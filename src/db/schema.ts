// this file is going to contain database tables
// drizzle is very type friendly
import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

// in excalidraw; we had tables - users/roles/employees
// pascal case
export const Todos = pgTable("todos", {
  // ALTER TABLE auto incrementing PK, default: uuid() - chances of error

  // decorator pattern is an experimantal feature in ecmascript standards
  // but those orms still use that

  // fluent interface, thenables
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  done: boolean("done").notNull().default(false),
});

// INSERT INTO values(naem, class, phone);

// flexibility abt drizzle is it gives types
export type Todo = typeof Todos.$inferSelect;
export type NewTodo = typeof Todos.$inferInsert;
