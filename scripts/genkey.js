import { generateKeyPair, exportPKCS8, exportSPKI } from "jose";

const { publicKey, privateKey } = await generateKeyPair("ES256", {
	extractable: true,
});

const pkcs8Pem = await exportPKCS8(privateKey);
const spkiPem = await exportSPKI(publicKey);

console.log(`JWT_PRIVATE_KEY="${pkcs8Pem}"`);
console.log(`JWT_PUBLIC_KEY="${spkiPem}"`);
