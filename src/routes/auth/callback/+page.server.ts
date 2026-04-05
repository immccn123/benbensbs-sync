import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { CLIENT_ID, CLIENT_SECRET, OAUTH_CALLBACK_URL } from "$env/static/private";

import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

import "node-fetch-with-proxy";
import { createToken } from "$lib/server/jwt/auth";

export const load: PageServerLoad = async ({ url, cookies, fetch, locals }) => {
	if (locals.user) return { user: locals.user };

	const code = url.searchParams.get("code");
	const stateFromUrl = url.searchParams.get("state");

	const stateFromCookie = cookies.get("oauth_state");

	if (!code || !stateFromUrl || stateFromUrl !== stateFromCookie) {
		throw error(400, "Invalid state or missing code. Possible CSRF attack.");
	}

	cookies.delete("oauth_state", { path: "/" });

	try {
		const tokenResponse = await fetch("https://auth.luogu.me/api/oauth/token", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				grant_type: "authorization_code",
				code,
				redirect_uri: OAUTH_CALLBACK_URL,
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
			}),
		});

		if (!tokenResponse.ok) {
			const errorData = await tokenResponse.json();
			throw error(
				500,
				`Failed to exchange token: ${errorData.error_description || "Unknown error"}`,
			);
		}

		const { access_token } = await tokenResponse.json();

		const userResponse = await fetch("https://auth.luogu.me/api/oauth/userinfo", {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		if (!userResponse.ok) {
			throw error(500, "Failed to fetch user info");
		}

		const userData = await userResponse.json();

		const { sub, display_name, avatar_url }: { [key: string]: string } = userData;

		const loginUser = await db
			.select()
			.from(user)
			.where(eq(user.sub, sub))
			.then((existingUser) => {
				if (existingUser.length !== 0) {
					db.update(user)
						.set({
							displayName: display_name,
							avatarUrl: avatar_url,
						})
						.where(eq(user.sub, sub));
					return existingUser[0];
				}
				return db
					.insert(user)
					.values({
						sub,
						displayName: display_name,
						avatarUrl: avatar_url,
					})
					.returning()
					.then((newUser) => newUser[0]);
			});

		if ((loginUser.permission & 1) === 0) {
			let restrictionReasons = loginUser.restrictionReason;
			throw error(
				403,
				`用户没有登录权限，原因是：${restrictionReasons}。如果您认为这是一个错误，请通过 benben.sbs 的 QQ 群联系管理员（群主）。`,
			);
		}

		const token = await createToken({ sub: loginUser.id.toString() }, "30d");

		cookies.set("auth_token", token, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 60 * 60 * 24 * 2, // 2 days
		});

		return { user: { ...loginUser } };
	} catch (err) {
		if (err instanceof Error) {
			throw error(500, `Authentication failed: ${err.message}`);
		}
		throw err;
	}
};
