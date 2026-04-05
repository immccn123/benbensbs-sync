import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, locals }) => {
	cookies.delete("auth_token", { path: "/" });
	if (locals.user) {
		return { user: locals.user };
	} else {
		return {};
	}
};
