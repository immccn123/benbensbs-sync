import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { ccbUserStat } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) throw error(401, "Unauthorized");

	const stat = await db
		.select()
		.from(ccbUserStat)
		.where(eq(ccbUserStat.userId, locals.user.id))
		.limit(1)
		.then(([x]) => x);

	return json({
		total: stat?.total ?? 0,
		offsetSum: stat?.offsetSum ?? 0,
		correctSum: stat?.correctSum ?? 0,
	});
};
