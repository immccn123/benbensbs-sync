export interface CcbColor {
	key: string;
	label: string;
	hex: string;
}

export const CCB_COLORS: CcbColor[] = [
	{ key: "cheater", label: "Cheater", hex: "#ad8b00" },
	{ key: "gray", label: "Gray", hex: "#bbbbbb" },
	{ key: "blue", label: "Blue", hex: "#3498db" },
	{ key: "green", label: "Green", hex: "#52c41a" },
	{ key: "orange", label: "Orange", hex: "#f39c11" },
	{ key: "red", label: "Red", hex: "#e74c3c" },
	{ key: "purple", label: "Purple", hex: "#9d3dcf" },
];

export const normalizeColorKey = (raw: string | null | undefined): string => {
	const c = (raw ?? "").trim().toLowerCase();
	const byKey = CCB_COLORS.find((x) => x.key === c);
	if (byKey) return byKey.key;
	const byHex = CCB_COLORS.find((x) => x.hex.toLowerCase() === c);
	if (byHex) return byHex.key;
	return "gray";
};

export const colorOf = (key: string): CcbColor =>
	CCB_COLORS.find((x) => x.key === key) ?? CCB_COLORS[1];

export const contrastText = (hex: string): string => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return lum > 0.6 ? "#000" : "#fff";
};

export const colorIndex = (key: string): number => {
	const i = CCB_COLORS.findIndex((x) => x.key === key);
	return i === -1 ? 1 : i;
};

export type TimeOfDay = "午夜" | "早上" | "上午" | "中午" | "下午" | "傍晚" | "晚上";

export const timeOfDayOf = (input: Date | string | number): TimeOfDay => {
	const h = new Date(input).getHours();
	if (h < 6) return "午夜";
	if (h < 9) return "早上";
	if (h < 11) return "上午";
	if (h < 13) return "中午";
	if (h < 17) return "下午";
	if (h < 19) return "傍晚";
	return "晚上";
};

export const dateOf = (input: Date | string | number): string => {
	const d = new Date(input);
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
};

export const maskUsername = (username: string): string =>
	"█".repeat([...username].length);

const hashString = (s: string): number => {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
};

const mulberry32 = (seed: number) => {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

const AVATAR_PALETTE = [
	"#e74c3c",
	"#3498db",
	"#52c41a",
	"#f39c11",
	"#9d3dcf",
	"#1abc9c",
	"#ad8b00",
	"#bbbbbb",
	"#2c3e50",
	"#e67e22",
];

export const maskAvatarCells = (seed: string, cells = 9): string[] => {
	const rand = mulberry32(hashString(seed));
	return Array.from({ length: cells }, () => {
		const color = AVATAR_PALETTE[Math.floor(rand() * AVATAR_PALETTE.length)];
		return rand() < 0.22 ? "transparent" : color;
	});
};

export interface GuestFeed {
	rowId: number;
	content: string;
	time: unknown;
	username: string;
	userId: number;
	userColor: string;
}

export const avatarUrl = (userId: number): string =>
	`https://cdn.luogu.com.cn/upload/usericon/${userId}.png`;
