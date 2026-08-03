CREATE TABLE "ccb_option_stat" (
	"option" varchar(16) PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ccb_puzzle" (
	"tmp_id" varchar(21) PRIMARY KEY NOT NULL,
	"row_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ccb_user_stat" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"total" integer DEFAULT 0 NOT NULL,
	"offset_sum" integer DEFAULT 0 NOT NULL,
	"correct_sum" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ccb_puzzle" ADD CONSTRAINT "ccb_puzzle_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ccb_user_stat" ADD CONSTRAINT "ccb_user_stat_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ccb_puzzle_user_created_idx" ON "ccb_puzzle" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "ccb_puzzle_row_id_idx" ON "ccb_puzzle" USING btree ("row_id");--> statement-breakpoint
CREATE INDEX "ccb_puzzle_expires_idx" ON "ccb_puzzle" USING btree ("expires_at");