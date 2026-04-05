import { json, error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { powChallenge, powInfo } from "$lib/server/db/schema";
import { verifySha256PoW, getUpdatedRisk } from "$lib/server/pow";
import { eq } from "drizzle-orm";

export const POST = async ({ request, locals }) => {
	if (!locals.user) throw error(401, "Unauthorized");
	const { answer } = await request.json();
	const userId = locals.user.id;

	const challenge = await db.query.powChallenge.findFirst({
		where: eq(powChallenge.userId, userId),
	});

	if (!challenge || challenge.deadline < new Date()) {
		throw error(400, "No active challenge found");
	}

	const currentRisk = await getUpdatedRisk(userId);

	const isValid = verifySha256PoW(
		challenge.nonce,
		answer,
		challenge.minDifficulty,
	);

	if (!isValid) {
		const newRisk = (currentRisk + 5760) * 2;
		await db
			.insert(powInfo)
			.values({
				userId: userId,
				riskValue: newRisk,
				riskLastUpdate: new Date(),
			})
			.onConflictDoUpdate({
				target: powInfo.userId,
				set: { riskValue: newRisk, riskLastUpdate: new Date() },
			});
		await db.delete(powChallenge).where(eq(powChallenge.userId, userId));

		throw error(400, "Invalid PoW answer; refresh and try again");
	}

	await db.delete(powChallenge).where(eq(powChallenge.userId, userId));
	await db
		.insert(powInfo)
		.values({
			userId,
			riskValue: currentRisk,
			riskLastUpdate: new Date(),
			credit: 2,
		})
		.onConflictDoUpdate({
			target: powInfo.userId,
			set: {
				riskValue: currentRisk,
				riskLastUpdate: new Date(),
				credit: 2,
			},
		});

	return json({ success: true });
};
