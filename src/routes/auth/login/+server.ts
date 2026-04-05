import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { nanoid } from "nanoid";
import { CLIENT_ID, OAUTH_CALLBACK_URL } from "$env/static/private";

export const GET: RequestHandler = async ({ cookies, locals }) => {
	if (locals.user) {
		throw redirect(302, "/auth/callback");
	}

	const state = nanoid();

	cookies.set("oauth_state", state, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax",
	});

	const authUrl =
		`https://auth.luogu.me/oauth/authorize?` +
		new URLSearchParams({
			client_id: CLIENT_ID,
			redirect_uri: OAUTH_CALLBACK_URL,
			response_type: "code",
			scope: "openid profile",
			state,
		});

	throw redirect(302, authUrl);
};
