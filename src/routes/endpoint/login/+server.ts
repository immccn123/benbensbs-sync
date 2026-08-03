import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { nanoid } from "nanoid";
import { SSO_URL, SSO_APP_ID, SSO_CALLBACK_URL, SSO_APP_CREDENTIAL } from "$env/static/private";
import { sanitizeReturnTo } from "$lib/server/return-to";

export const GET: RequestHandler = async ({ cookies, locals, url }) => {
	const returnTo = sanitizeReturnTo(url.searchParams.get("return_to"));

	if (locals.user) {
		throw redirect(302, returnTo ?? "/auth/callback");
	}

	const state = nanoid();

	cookies.set("sso_state", state, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax",
	});

	if (returnTo) {
		cookies.set("sso_return_to", returnTo, {
			path: "/",
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: "lax",
		});
	}

	const authUrl =
		`${SSO_URL}/flow/auth?` +
		new URLSearchParams({
			app_id: SSO_APP_ID,
			callback_url: SSO_CALLBACK_URL,
			credential: SSO_APP_CREDENTIAL,
			state,
		});

	throw redirect(302, authUrl);
};
