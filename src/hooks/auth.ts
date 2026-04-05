import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import { verifyToken } from "$lib/server/jwt/auth";
import type { Handle } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const authHandle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get("auth_token");

	if (token) {
		try {
			const payload = await verifyToken(token);
			const { exp, iat, sub } = payload ?? {};
			const now = Date.now() / 1000;
			if (!exp || now >= exp || !sub || !iat) {
				throw "invalidJwt";
			}
			const loginUser = await db
				.select()
				.from(user)
				.where(eq(user.id, +sub))
				.limit(1)
				.then(([x]) => x);

			if (!loginUser || iat < loginUser.sessionValidAfter.getTime() / 1000) {
				throw "invalidUserOrSession";
			}

			if (!(loginUser.permission & 1)) {
				// revoke token if user has no login permission
				throw "noLoginPermission";
			}

			event.locals.user = loginUser;
		} catch (e) {
			if (typeof e === "string") {
				event.cookies.delete("auth_token", { path: "/" });
			} else {
				throw e;
			}
		}
	}

	const response = await resolve(event);

	return response;
};
