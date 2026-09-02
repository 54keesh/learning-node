// drizzle adapter on top of actual db client like node-pg, pgcore
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// connection string means how to connect to a database
// it should have following
// - username
// - password
// - hostname
// - database name
// - port name (5432)
// postgres://user:password@hostname:port_name/database_name

// env is the place where we hold senstive vars
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env and fill it in.",
  );
}

const client = postgres(connectionString);

// it creates the connection once and uses that
export const db = drizzle(client);
