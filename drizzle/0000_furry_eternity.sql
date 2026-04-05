CREATE TABLE "collection" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(24) NOT NULL,
	"creator_id" integer NOT NULL,
	"items" integer[] NOT NULL,
	CONSTRAINT "collection_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pow_challenge" (
	"id" serial NOT NULL,
	"user_id" integer PRIMARY KEY NOT NULL,
	"nonce" varchar(32) NOT NULL,
	"min_difficulty" integer NOT NULL,
	"deadline" timestamp with time zone NOT NULL,
	CONSTRAINT "pow_challenge_id_unique" UNIQUE("id"),
	CONSTRAINT "pow_challenge_nonce_unique" UNIQUE("nonce")
);
--> statement-breakpoint
CREATE TABLE "pow_info" (
	"id" integer PRIMARY KEY NOT NULL,
	"credit" integer DEFAULT 0 NOT NULL,
	"deadline" timestamp with time zone DEFAULT now() NOT NULL,
	"risk_value" bigint DEFAULT 0 NOT NULL,
	"risk_last_update" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"sub" text NOT NULL,
	"display_name" text,
	"avatar_url" text,
	"session_valid_after" timestamp with time zone DEFAULT now() NOT NULL,
	"permission" bigint DEFAULT 3 NOT NULL,
	"restriction_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_sub_unique" UNIQUE("sub")
);
--> statement-breakpoint
CREATE TABLE "userdata" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"data_key" varchar(64) NOT NULL,
	"data_value" text,
	"archive_id" bigint DEFAULT 1 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_key" UNIQUE("user_id","data_key")
);
--> statement-breakpoint
ALTER TABLE "collection" ADD CONSTRAINT "collection_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pow_challenge" ADD CONSTRAINT "pow_challenge_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pow_info" ADD CONSTRAINT "pow_info_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userdata" ADD CONSTRAINT "userdata_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "collection_creator_user_id" ON "collection" USING btree ("creator_id","id");--> statement-breakpoint
CREATE INDEX "user_key_idx" ON "userdata" USING btree ("user_id","data_key");