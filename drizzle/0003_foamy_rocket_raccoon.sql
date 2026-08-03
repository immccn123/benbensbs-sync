DROP TABLE "ccb_option_stat";--> statement-breakpoint
CREATE TABLE "ccb_option_stat" (
	"row_id" integer NOT NULL,
	"option" varchar(16) NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "ccb_option_stat_row_id_option_pk" PRIMARY KEY("row_id","option")
);
