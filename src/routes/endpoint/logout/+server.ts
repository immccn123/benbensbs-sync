import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { decodeSsoToken } from "$lib/server/jwt/auth";
import { db } from "$lib/server/db";
import { revokedSession } from "$lib/server/db/schema";

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get("sso_token");

	if (token) {
		const payload = decodeSsoToken(token);
		if (payload?.jti && payload?.exp) {
			await db
				.insert(revokedSession)
				.values({
					jti: payload.jti as string,
					exp: new Date((payload.exp as number) * 1000),
				})
				.onConflictDoNothing();
		}
	}

	cookies.delete("sso_token", { path: "/" });
	return json({ success: true });
};
