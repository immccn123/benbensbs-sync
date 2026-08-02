import { db } from "$lib/server/db";
import { user, revokedSession } from "$lib/server/db/schema";
import { verifySsoToken } from "$lib/server/jwt/auth";
import type { Handle } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const authHandle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get("sso_token");

	if (token) {
		try {
			const payload = await verifySsoToken(token);
			const { sub, iat, jti } = payload;

			if (!sub || !iat || !jti) throw "invalidJwt";

			const loginUser = await db
				.select()
				.from(user)
				.where(eq(user.sub, sub))
				.limit(1)
				.then(([x]) => x);

			if (!loginUser) throw "noUser";

			if (iat < loginUser.sessionValidAfter.getTime() / 1000)
				throw "sessionInvalidated";

			const revoked = await db
				.select({ jti: revokedSession.jti })
				.from(revokedSession)
				.where(eq(revokedSession.jti, jti))
				.limit(1)
				.then(([x]) => x);

			if (revoked) throw "revoked";

			if (!(loginUser.permission & 1)) throw "noPermission";

			event.locals.user = {
				...loginUser,
				displayName: payload.display_name ?? loginUser.displayName,
				avatarUrl: payload.avatar_url ?? loginUser.avatarUrl,
			};
		} catch (e) {
			if (typeof e === "string") {
				event.cookies.delete("sso_token", { path: "/" });
			} else {
				throw e;
			}
		}
	}

	return resolve(event);
};
