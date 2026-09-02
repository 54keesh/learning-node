// Node (conclude today)
// Docker + AWS = must

import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import { Todos, type NewTodo } from "./db/schema.js";

const app = new Hono();

app.use(logger());

// In backend apps, ->
// all 4 of these operations are called -> CRUD
// Create, read, update, delete

// mastering these 4 means you can almost make all kinds of apps

// API https verbs and their terminologies

// POST = create a resource
// GET = Get/Fetch a resource
// DELETE = Delete a resource
// PUT = Update a resource
// PATCH = Partial update a resource
// QUERY = SEARCHING - recently introduced

// CREATE
// first argument is called route starts from slash
// second argument is route handler

// funfact: android is also linux
// all apps/process/software/tool must be run on some port

// TBD: vhosts
// application has to be on some server/machine with ip - 10.1.45.123
// localhost = home and home has special ip and we call that localhost/127.0.0.1 : loopback_address

// networking, ssl, http, dns, ftp, postgres, mysql, iot devices - some port
// port in between 0 - 65535 and 0 - 1024 cannot be used because they are reserved for OS(windows/linux/Mac) specifc processes
// GET localhost:3000/todos

// domain = unique name of your server
// server = server + ip

// Every domain(name) is mapped to an ip(physical_addres)
// so domain = ip
// google.com = 343.34.32.53
// dns - domain name server - to resolve domains -> ips

// localhost = name of our machine
// 3000 = process/port of app/server
// everything after / = hono/express/server specific routes

// Generics: typed arguments
// functions accepts arguemnts
// functions can also accept arguments of types

app.post("/todos", async (context: Context) => {
  const body = await context.req.json<{ title: string; done: boolean }>();

  const [todo] = await db
    .insert(Todos)
    .values({ title: body.title, done: body.done })
    // it just tells to return the inserted record
    // this is postgres only
    .returning();

  return context.json(todo, 201);
});

// READ all
app.get("/todos", async (c) => {
  const allTodos = await db.select().from(Todos);

  return c.json(allTodos);
});

// READ one
// GET /todos/123
// query params that starts with ?keyword=chcolate
// path parameters
app.get("/todos/:id", async (c) => {
  const id = c.req.param("id");
  // sql injection - you never take user input and then pass that straight to db
  // NEVER EVER

  // prepared sql statements
  // they first send the query
  // and then later send the arguments
  const [todo] = await db.select().from(Todos).where(eq(Todos.id, id));

  if (!todo) return c.json({ error: "Not found" }, 404);

  return c.json(todo);
});

// UPDATE
// PUT /todos/123; body => { title: "testing", done: true }
// UPDATE todos SET title = test where id =1;
app.put("/todos/:id", async (c) => {
  const id = c.req.param("id");
  const body: NewTodo = await c.req.json();

  const [todo] = await db
    .update(Todos)
    .set(body)
    .where(eq(Todos.id, id))
    .returning();

  if (!todo) return c.json({ error: "Not found" }, 404);

  return c.json(todo);
});

// DELETE
// DELETE /todos/123 -> no body
app.delete("/todos/:id", async (c) => {
  const id = c.req.param("id");

  // returning says perform the operation and also return the columns - only postgres
  const [todo] = await db.delete(Todos).where(eq(Todos.id, id)).returning();

  if (!todo) return c.json({ error: "Not found" }, 404);

  return c.json({ deleted: id });
});

export default app;
