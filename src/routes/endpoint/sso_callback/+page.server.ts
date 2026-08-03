import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { verifySsoToken } from "$lib/server/jwt/auth";
import { db } from "$lib/server/db";
import { user, revokedSession } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { sanitizeReturnTo } from "$lib/server/return-to";

export const load: PageServerLoad = async ({ url, cookies }) => {
	const state = url.searchParams.get("state");
	const token = url.searchParams.get("token");
	const stateCookie = cookies.get("sso_state");

	if (!state || !token || !stateCookie || state !== stateCookie) {
		throw error(400, "Invalid state or missing token. Possible CSRF attack.");
	}

	cookies.delete("sso_state", { path: "/" });

	let payload;
	try {
		payload = await verifySsoToken(token);
	} catch {
		throw error(401, "Token verification failed");
	}

	const { sub, iat, jti, exp, display_name, avatar_url } = payload;
	if (!sub || !iat || !jti) throw error(400, "Incomplete token claims");

	const revoked = await db
		.select({ jti: revokedSession.jti })
		.from(revokedSession)
		.where(eq(revokedSession.jti, jti))
		.limit(1)
		.then(([x]) => x);

	if (revoked) throw error(401, "Session has been revoked");

	const [existingUser] = await db
		.select()
		.from(user)
		.where(eq(user.sub, sub))
		.limit(1);

	const profileUpdate: { displayName?: string; avatarUrl?: string } = {};
	if (display_name) profileUpdate.displayName = display_name;
	if (avatar_url) profileUpdate.avatarUrl = avatar_url;

	if (existingUser) {
		if (iat < existingUser.sessionValidAfter.getTime() / 1000) {
			throw error(401, "Session invalidated");
		}
		if (!(existingUser.permission & 1)) {
			throw error(
				403,
				`用户没有登录权限，原因是：${existingUser.restrictionReason}。如果您认为这是一个错误，请通过 benben.sbs 的 QQ 群联系管理员（群主）。`,
			);
		}
		if (Object.keys(profileUpdate).length > 0) {
			await db.update(user).set(profileUpdate).where(eq(user.sub, sub));
		}
	} else {
		await db.insert(user).values({ sub, ...profileUpdate });
	}

	const maxAge = exp ? Math.max(0, exp - Math.floor(Date.now() / 1000)) : 2592000;

	cookies.set("sso_token", token, {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		maxAge,
	});

	const returnTo = sanitizeReturnTo(cookies.get("sso_return_to"));
	cookies.delete("sso_return_to", { path: "/" });

	throw redirect(302, returnTo ?? "/auth/callback");
};
