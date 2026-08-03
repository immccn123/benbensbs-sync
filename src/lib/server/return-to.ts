export const sanitizeReturnTo = (raw: string | null | undefined): string | null => {
	if (!raw) return null;
	if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return null;
	return raw;
};
