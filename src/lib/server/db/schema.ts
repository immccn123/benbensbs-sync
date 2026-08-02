import type { InferSelectModel } from "drizzle-orm";
import {
	pgTable,
	serial,
	integer,
	text,
	timestamp,
	bigint,
	varchar,
	unique,
	index,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: serial("id").primaryKey(),
	sub: text("sub").notNull().unique(),
	displayName: text("display_name"),
	avatarUrl: text("avatar_url"),
	sessionValidAfter: timestamp("session_valid_after", { withTimezone: true })
		.notNull()
		.defaultNow(),
	permission: bigint({ mode: "number" }).notNull().default(0b11),
	restrictionReason: text("restriction_reason"),

	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = InferSelectModel<typeof user>;

export const userdata = pgTable(
	"userdata",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		dataKey: varchar("data_key", { length: 64 }).notNull(),
		dataValue: text("data_value"),
		archiveId: bigint("archive_id", { mode: "number" }).default(1).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [
		unique("unique_user_key").on(t.userId, t.dataKey),
		index("user_key_idx").on(t.userId, t.dataKey),
	],
);

export const collection = pgTable(
	"collection",
	{
		id: serial("id").primaryKey(),
		slug: varchar("slug", { length: 24 }).notNull().unique(),
		creatorId: integer("creator_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		items: integer("items").array().notNull(),
	},
	(t) => [index("collection_creator_user_id").on(t.creatorId, t.id)],
);

export const powInfo = pgTable("pow_info", {
	userId: integer("id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	credit: integer("credit").default(0).notNull(),
	deadline: timestamp("deadline", { withTimezone: true }).notNull().defaultNow(),
	riskValue: bigint("risk_value", { mode: "number" }).notNull().default(0),
	riskLastUpdate: timestamp("risk_last_update", { withTimezone: true }).notNull().defaultNow(),
});

export const powChallenge = pgTable("pow_challenge", {
	id: serial("id").unique(),
	userId: integer("user_id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	nonce: varchar("nonce", { length: 32 }).notNull().unique(),
	minDifficulty: integer("min_difficulty").notNull(),
	deadline: timestamp("deadline", { withTimezone: true }).notNull(),
});

export const revokedSession = pgTable("revoked_session", {
	jti: text("jti").primaryKey(),
	exp: timestamp("exp", { withTimezone: true }).notNull(),
});
