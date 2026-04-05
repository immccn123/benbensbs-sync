import { json, error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { powChallenge } from "$lib/server/db/schema";
import { getUpdatedRisk } from "$lib/server/pow";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const GET = async ({ locals }) => {
	if (!locals.user) throw error(401, "Unauthorized");
	const userId = locals.user.id;

	const currentRisk = await getUpdatedRisk(userId);
	if (currentRisk > 240000) {
		throw error(403, "Risk value too high. Please wait.");
	}

	const existing = await db.query.powChallenge.findFirst({
		where: eq(powChallenge.userId, userId),
	});
	if (existing && existing.deadline > new Date()) {
		return json({
			nonce: existing.nonce,
			difficulty: existing.minDifficulty,
		});
	}

	const nonce = nanoid(32);
	const difficulty = 12 + Math.floor(currentRisk / 20000);

	await db
		.insert(powChallenge)
		.values({
			userId,
			nonce,
			minDifficulty: difficulty,
			deadline: new Date(Date.now() + 5 * 60 * 1000),
		})
		.onConflictDoUpdate({
			target: powChallenge.userId,
			set: {
				nonce,
				minDifficulty: difficulty,
				deadline: new Date(Date.now() + 5 * 60 * 1000),
			},
		});

	return json({ nonce, difficulty });
};
