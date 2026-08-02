CREATE TABLE "revoked_session" (
	"jti" text PRIMARY KEY NOT NULL,
	"exp" timestamp with time zone NOT NULL
);
