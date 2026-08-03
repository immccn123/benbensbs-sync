import { db } from "./db";
import { powInfo } from "./db/schema";
import { eq } from "drizzle-orm";

export async function getUpdatedRisk(userId: number) {
	const info = await db.query.powInfo.findFirst({
		where: eq(powInfo.userId, userId),
	});

	if (!info) return 0;

	const now = new Date();
	const nowTs = now.getTime();
	const elapsedSeconds = Math.floor((nowTs - info.riskLastUpdate.getTime()) / 1000);
	const currentRisk = Math.max(0, info.riskValue - elapsedSeconds);

	if (Math.abs(currentRisk - info.riskValue) > 5760 || currentRisk === 0) {
		await db
			.insert(powInfo)
			.values({
				userId,
				riskValue: currentRisk,
				riskLastUpdate: now,
			})
			.onConflictDoUpdate({
				target: powInfo.userId,
				set: { riskValue: currentRisk, riskLastUpdate: now },
			});
	}

	return currentRisk;
}

export async function verifySha256PoW(
	nonce: string,
	answer: string,
	difficulty: number,
): Promise<boolean> {
	const msg = "bssync+" + nonce + answer;
	const encoder = new TextEncoder();
	const data = encoder.encode(msg);

	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashBytes = new Uint8Array(hashBuffer);

	const fullBytes = Math.floor(difficulty / 8);
	const remainingBits = difficulty % 8;

	for (let i = 0; i < fullBytes; i++) {
		if (hashBytes[i] !== 0) return false;
	}

	if (remainingBits > 0) {
		const nextByte = hashBytes[fullBytes];
		if (nextByte >= Math.pow(2, 8 - remainingBits)) return false;
	}

	return true;
}
