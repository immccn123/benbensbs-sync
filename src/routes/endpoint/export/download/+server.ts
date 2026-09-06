import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { findLatestCompleted } from "$lib/server/export/worker";

const gzip = async (text: string): Promise<ArrayBuffer> => {
	const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
	return await new Response(stream).arrayBuffer();
};

export const GET: RequestHandler = async ({ request, locals }) => {
	const currentUser = locals.user;
	if (!currentUser) throw error(401, "Unauthorized");

	const luogu = locals.luoguAccount ?? null;
	if (!luogu) throw error(400, "需要在 CPOAuth 绑定洛谷，若已经绑定则登出后请重新认证；若有特殊情况加群 313404608 联系站长");

	const task = await findLatestCompleted(currentUser.id);
	if (!task || task.data === null) throw error(404, "没有可下载的导出结果");

	const filename = `benben-export-${luogu.platformUid}-${task.id}.json`;
	const headers: Record<string, string> = {
		"Content-Type": "application/json; charset=utf-8",
		"Content-Disposition": `attachment; filename="${filename}"`,
		"Cache-Control": "private, max-age=0",
	};

	const acceptEncoding = request.headers.get("accept-encoding") ?? "";
	if (acceptEncoding.includes("gzip")) {
		headers["Content-Encoding"] = "gzip";
		return new Response(await gzip(task.data), { headers });
	}

	return new Response(task.data, { headers });
};
