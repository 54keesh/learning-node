CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"done" boolean DEFAULT false NOT NULL
);
