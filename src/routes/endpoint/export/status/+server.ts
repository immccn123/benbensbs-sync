import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
	countCompletedExports,
	findActiveExport,
	findCachedExport,
	findLatestTask,
	serializeTask,
	EXPORT_QUOTA,
} from "$lib/server/export/worker";
import { type ExportStatusResponse } from "$lib/export";

export const GET: RequestHandler = async ({ locals }) => {
	const currentUser = locals.user;
	const luogu = locals.luoguAccount ?? null;

	if (!currentUser) {
		return json({
			authenticated: false,
			luogu: null,
			quota: { used: 0, limit: EXPORT_QUOTA },
			task: null,
		} satisfies ExportStatusResponse);
	}

	const used = await countCompletedExports(currentUser.id);

	let task = await findCachedExport(currentUser.id);
	let cached = task !== null;

	if (!task) {
		task = await findActiveExport(currentUser.id);
	}

	if (!task) {
		const latest = await findLatestTask(currentUser.id);
		if (latest && latest.status === "failed") task = latest;
	}

	return json({
		authenticated: true,
		luogu,
		quota: { used, limit: EXPORT_QUOTA },
		task: task ? serializeTask(task, cached) : null,
	} satisfies ExportStatusResponse);
};
