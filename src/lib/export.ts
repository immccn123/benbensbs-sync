export type ExportStatus = "pending" | "processing" | "completed" | "failed";

export interface ExportTaskInfo {
	id: number;
	status: ExportStatus;
	fileSize: number;
	error: string | null;
	createdAt: string | null;
	startedAt: string | null;
	completedAt: string | null;
	cached: boolean;
}

export interface ExportStatusResponse {
	authenticated: boolean;
	luogu: { platform: "luogu"; platformUid: string; platformUsername: string } | null;
	quota: { used: number; limit: number };
	task: ExportTaskInfo | null;
}

export interface ExportActionResult {
	ok: boolean;
	code?: "no_luogu" | "quota_exceeded" | "not_authenticated";
	message?: string;
	task?: ExportTaskInfo;
}
