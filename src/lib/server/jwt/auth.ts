import { jwtVerify, importSPKI, decodeJwt, type JWTPayload } from "jose";
import { SSO_JWT_VERIFY_KEY, SSO_APP_ID, SSO_URL } from "$env/static/private";

const ALG = "ES256";

const verifyKey = await importSPKI(SSO_JWT_VERIFY_KEY, ALG);

export interface LinkedAccount {
	platform?: string;
	platformUid?: string;
	platformUsername?: string;
}

export interface SsoPayload extends JWTPayload {
	sub: string;
	jti: string;
	display_name?: string;
	avatar_url?: string;
	username?: string;
	linked_accounts?: LinkedAccount[];
}

export interface LuoguAccount {
	platform: "luogu";
	platformUid: string;
	platformUsername: string;
}

export const extractLuoguAccount = (payload: SsoPayload): LuoguAccount | null => {
	const linked = payload.linked_accounts;
	if (!Array.isArray(linked)) return null;

	const item = linked.find((a) => a && a.platform === "luogu");
	if (!item) return null;

	const uid = typeof item.platformUid === "string" ? item.platformUid.trim() : "";
	if (!/^\d+$/.test(uid)) return null;

	const username = typeof item.platformUsername === "string" ? item.platformUsername.trim() : "";
	if (!username) return null;

	return { platform: "luogu", platformUid: uid, platformUsername: username };
};

export const verifySsoToken = async (token: string): Promise<SsoPayload> => {
	const { payload } = await jwtVerify(token, verifyKey, {
		algorithms: [ALG],
		audience: SSO_APP_ID,
		issuer: SSO_URL,
	});
	return payload as SsoPayload;
};

export const decodeSsoToken = (token: string) => {
	try {
		return decodeJwt(token);
	} catch {
		return null;
	}
};
