import { json, error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { userdata } from "$lib/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import typia, { tags, TypeGuardError } from "typia";

const allowedOrigins = ['http://localhost:5173', 'https://benben.sbs', 'https://aws.benben.sbs', 'https://eo.benben.sbs'];

const corsHeaders = (origin: string) => ({
	'Access-Control-Allow-Origin': origin,
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	'Access-Control-Allow-Credentials': 'true',
});

export const OPTIONS: RequestHandler = async ({ request }) => {
	const origin = request.headers.get('origin');
    
	if (origin && allowedOrigins.includes(origin)) {
		return new Response(null, {
			headers: corsHeaders(origin)
		});
	}

	return new Response(null, { status: 204 });
};

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) throw error(401, "Unauthorized");

	const key = url.searchParams.get("key");
	if (!key) throw error(400, "Missing key");

	const [result] = await db
		.select()
		.from(userdata)
		.where(and(eq(userdata.userId, locals.user.id), eq(userdata.dataKey, key)))
		.limit(1);

	return json(result ?? { dataKey: key, dataValue: null, archiveId: 0 });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	interface Payload {
		key: string;
		value: string & tags.MaxLength<4096>;
		archiveId: number;
	}

	if (!locals.user) throw error(401, "Unauthorized");

	let response: Payload;

	try {
		response = await request.json();
		typia.assert<Payload>(response);
	} catch (e) {
		if (e instanceof TypeGuardError) {
			// @ts-expect-error
			delete e.value;
		}
		if (e instanceof Error) throw error(400, e);
		throw e;
	}

	const { key, value, archiveId } = response;

	if (["settings"].every((x) => key != x)) throw error(400, "Invalid key");

	if (!key) throw error(400, "Invalid payload");

	await db
		.insert(userdata)
		.values({
			userId: locals.user.id,
			dataKey: key,
			dataValue: value,
			archiveId: archiveId,
			updatedAt: sql`now()`,
		})
		.onConflictDoUpdate({
			target: [userdata.userId, userdata.dataKey],
			set: {
				dataValue: value,
				archiveId: archiveId,
				updatedAt: sql`now()`,
			},
			where: sql`${userdata.archiveId} != ${archiveId} OR ${userdata.dataValue} IS DISTINCT FROM ${value}`,
		});

	return json({ success: true });
};
