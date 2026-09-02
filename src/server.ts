// src/server.ts
import { serve } from "@hono/node-server";
import app from "./index";

serve({ fetch: app.fetch, port: 3000 });
console.log("Running on http://localhost:3000");
