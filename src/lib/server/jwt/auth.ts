import { jwtVerify, importSPKI, decodeJwt, type JWTPayload } from "jose";
import { SSO_JWT_VERIFY_KEY, SSO_APP_ID, SSO_URL } from "$env/static/private";

const ALG = "ES256";

const verifyKey = await importSPKI(SSO_JWT_VERIFY_KEY, ALG);

export interface SsoPayload extends JWTPayload {
	sub: string;
	jti: string;
	display_name?: string;
	avatar_url?: string;
	username?: string;
}

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
