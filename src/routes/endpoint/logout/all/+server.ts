import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { decodeSsoToken } from "$lib/server/jwt/auth";
import { db } from "$lib/server/db";
import { user, revokedSession } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const POST: RequestHandler = async ({ cookies, locals }) => {
	if (!locals.user) throw error(401, "Unauthorized");

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

	await db
		.update(user)
		.set({ sessionValidAfter: new Date() })
		.where(eq(user.id, locals.user.id));

	cookies.delete("sso_token", { path: "/" });
	return json({ success: true });
};
