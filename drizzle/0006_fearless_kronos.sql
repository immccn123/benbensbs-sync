CREATE TABLE "feed_export" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"luogu_uid" varchar(32) NOT NULL,
	"luogu_username" varchar(128) NOT NULL,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"data" text,
	"file_size" integer DEFAULT 0 NOT NULL,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "feed_export" ADD CONSTRAINT "feed_export_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feed_export_user_created_idx" ON "feed_export" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "feed_export_status_idx" ON "feed_export" USING btree ("status");