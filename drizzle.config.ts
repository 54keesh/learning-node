// drizzle studio is a development/production database client
// its exactly like phpMyAdmin
// exposes an http server, takes sql from FE, and calls the db client with that sql

// drizzle-kit is a client for cli
// to generate migrations and run migrations and do any db related stuff
// outisde of server app
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // this schema means migrations/orm classes not the postgres schema
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // orm with postresql defaults to public schema
  // odm - object document mapper for non relational
});

// migration is when you make changes in database
// ALTER TABLE TODOS alter column id uuid - NEVER DO this directly in database
// rather than going to databse and doing it manually
// we create migrations which are also added to git

// script of database sqls
// we initally up the migration
// or rollback - down
