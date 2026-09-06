import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { feedExport } from "$lib/server/db/schema";
import {
	countCompletedExports,
	enqueueExport,
	findActiveExport,
	findCachedExport,
	serializeTask,
	EXPORT_QUOTA,
} from "$lib/server/export/worker";
import { type ExportActionResult } from "$lib/export";

export const POST: RequestHandler = async ({ locals }) => {
	const currentUser = locals.user;
	if (!currentUser) throw error(401, "Unauthorized");

	const luogu = locals.luoguAccount ?? null;
	if (!luogu) {
		return json(
			{
				ok: false,
				code: "no_luogu",
				message: "需要在 CPOAuth 绑定洛谷，若已经绑定则登出后请重新认证；若有特殊情况加群 313404608 联系站长",
			} satisfies ExportActionResult,
			{ status: 400 },
		);
	}

	const cached = await findCachedExport(currentUser.id);
	if (cached) {
		return json({ ok: true, task: serializeTask(cached, true) } satisfies ExportActionResult);
	}

	const active = await findActiveExport(currentUser.id);
	if (active) {
		return json({ ok: true, task: serializeTask(active, false) } satisfies ExportActionResult);
	}

	const used = await countCompletedExports(currentUser.id);
	if (used >= EXPORT_QUOTA) {
		return json(
			{
				ok: false,
				code: "quota_exceeded",
				message: "如有特殊情况加群联系站长",
			} satisfies ExportActionResult,
			{ status: 403 },
		);
	}

	const [task] = await db
		.insert(feedExport)
		.values({
			userId: currentUser.id,
			luoguUid: luogu.platformUid,
			luoguUsername: luogu.platformUsername,
			status: "pending",
		})
		.returning();

	enqueueExport();

	return json({ ok: true, task: serializeTask(task, false) } satisfies ExportActionResult);
};
