import { SignJWT, jwtVerify, importPKCS8, importSPKI, type JWTPayload } from "jose";
import { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } from "$env/static/private";

const ALG = "ES256";

const privateKey = await importPKCS8(JWT_PRIVATE_KEY, ALG);
const publicKey = await importSPKI(JWT_PUBLIC_KEY, ALG);

interface Payload extends JWTPayload {
	sub: string;
}

export const createToken = (payload: Payload, expires = "48h", issuedAt = new Date()) =>
	new SignJWT(payload)
		.setProtectedHeader({ alg: ALG })
		.setIssuedAt(issuedAt)
		.setExpirationTime(expires)
		.sign(privateKey);

export const verifyToken = async (token: string) => {
	try {
		const { payload } = await jwtVerify(token, publicKey, {
			algorithms: [ALG],
		});
		return payload;
	} catch {
		return null;
	}
};
