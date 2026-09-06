// See https://svelte.dev/docs/kit/types#app.d.ts

import type { User } from "$lib/server/db/schema";
import type { LuoguAccount } from "$lib/server/jwt/auth";

// for information about these interfaces
declare global {
	const __LASTMOD__: string | undefined;
	const __VERSION__: string | undefined;

	namespace App {
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			user?: User;
			luoguAccount?: LuoguAccount | null;
			sessionInvalid?: boolean;
		}
	}
}

export {};
