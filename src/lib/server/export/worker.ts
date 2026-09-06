import { db } from "$lib/server/db";
import { feedExport, type FeedExport } from "$lib/server/db/schema";
import { and, asc, eq, gte, desc, sql, inArray } from "drizzle-orm";
import { buildExportJson, fetchAllFeeds } from "./feed-export";
import { type ExportTaskInfo, type ExportStatus } from "$lib/export";

export const EXPORT_QUOTA = 3;
const EXPORT_CACHE_TTL_MS = 48 * 60 * 60 * 1000;

let running = false;
let queued = false;

const claimNext = async (): Promise<FeedExport | null> => {
	const [next] = await db
		.select()
		.from(feedExport)
		.where(eq(feedExport.status, "pending"))
		.orderBy(asc(feedExport.id))
		.limit(1);

	if (!next) return null;

	const [claimed] = await db
		.update(feedExport)
		.set({ status: "processing", startedAt: new Date() })
		.where(and(eq(feedExport.id, next.id), eq(feedExport.status, "pending")))
		.returning();

	return claimed ?? null;
};

const runTask = async (task: FeedExport): Promise<void> => {
	try {
		const feeds = await fetchAllFeeds(Number(task.luoguUid));
		const data = buildExportJson(task.luoguUid, task.luoguUsername, feeds);

		await db
			.update(feedExport)
			.set({
				status: "completed",
				data,
				fileSize: new TextEncoder().encode(data).length,
				error: null,
				completedAt: new Date(),
			})
			.where(eq(feedExport.id, task.id));
	} catch (e) {
		await db
			.update(feedExport)
			.set({
				status: "failed",
				error: e instanceof Error ? e.message : "导出失败",
				completedAt: new Date(),
			})
			.where(eq(feedExport.id, task.id));
	}
};

const drain = async (): Promise<void> => {
	running = true;
	try {
		while (queued) {
			queued = false;
			const task = await claimNext().catch(() => null);
			if (!task) break;
			await runTask(task).catch(() => {});
		}
	} finally {
		running = false;
		if (queued) void drain();
	}
};

export const enqueueExport = (): void => {
	queued = true;
	if (running) return;
	void drain();
};

export const initExportWorker = (): void => {
	void (async () => {
		await db
			.update(feedExport)
			.set({ status: "pending", startedAt: null, error: null })
			.where(eq(feedExport.status, "processing"))
			.catch(() => {});
		enqueueExport();
	})();
};

export const countCompletedExports = async (userId: number): Promise<number> => {
	const [row] = await db
		.select({ value: sql<number>`count(*)::int` })
		.from(feedExport)
		.where(and(eq(feedExport.userId, userId), eq(feedExport.status, "completed")));
	return row?.value ?? 0;
};

export const findActiveExport = async (userId: number): Promise<FeedExport | null> =>
	db
		.select()
		.from(feedExport)
		.where(
			and(
				eq(feedExport.userId, userId),
				inArray(feedExport.status, ["pending", "processing"]),
			),
		)
		.orderBy(asc(feedExport.id))
		.limit(1)
		.then(([x]) => x ?? null);

export const findCachedExport = async (userId: number): Promise<FeedExport | null> => {
	const since = new Date(Date.now() - EXPORT_CACHE_TTL_MS);
	return db
		.select()
		.from(feedExport)
		.where(
			and(
				eq(feedExport.userId, userId),
				eq(feedExport.status, "completed"),
				gte(feedExport.completedAt, since),
			),
		)
		.orderBy(desc(feedExport.id))
		.limit(1)
		.then(([x]) => x ?? null);
};

export const findLatestCompleted = async (userId: number): Promise<FeedExport | null> =>
	db
		.select()
		.from(feedExport)
		.where(and(eq(feedExport.userId, userId), eq(feedExport.status, "completed")))
		.orderBy(desc(feedExport.id))
		.limit(1)
		.then(([x]) => x ?? null);

export const findLatestTask = async (userId: number): Promise<FeedExport | null> =>
	db
		.select()
		.from(feedExport)
		.where(eq(feedExport.userId, userId))
		.orderBy(desc(feedExport.id))
		.limit(1)
		.then(([x]) => x ?? null);

export const EXPORT_QUOTA_LIMIT = EXPORT_QUOTA;

export const serializeTask = (task: FeedExport, cached: boolean): ExportTaskInfo => ({
	id: task.id,
	status: task.status as ExportStatus,
	fileSize: task.fileSize,
	error: task.error,
	createdAt: task.createdAt?.toISOString() ?? null,
	startedAt: task.startedAt?.toISOString() ?? null,
	completedAt: task.completedAt?.toISOString() ?? null,
	cached,
});
