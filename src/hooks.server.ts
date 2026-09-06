import { authHandle } from "$hook/auth";
import { initExportWorker } from "$lib/server/export/worker";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

initExportWorker();

export const handle: Handle = sequence(authHandle);
