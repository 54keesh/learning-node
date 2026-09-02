# Setup

```
npm install
cp .env.example .env   # then set DATABASE_URL to your Postgres instance
npm run db:generate    # generate SQL migration from src/db/schema.ts
npm run db:migrate     # apply migrations to the database
npm run dev
```

```
open http://localhost:3000
```

# Testing the API

Use [requests.http](requests.http) with the VS Code REST Client (or
IntelliJ/WebStorm's built-in HTTP client) — click "Send Request" above
each block.

Or use curl:

```bash
# Create
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy milk"}'

# List all
curl http://localhost:3000/todos

# Get one (replace :id)
curl http://localhost:3000/todos/:id

# Update
curl -X PUT http://localhost:3000/todos/:id \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy oat milk", "done": true}'

# Delete
curl -X DELETE http://localhost:3000/todos/:id
```
