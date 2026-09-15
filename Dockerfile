# One Dockerfile, multiple named stages. `docker build` (and compose) picks
# which one to actually run with `--target <name>` / `target: <name>`:
#
#   docker build --target dev    -t todos-app:dev  .   # live-reload, tsx watch
#   docker build --target runner -t todos-app:prod .   # compiled, production-style
#
# "deps" is shared setup both of the above build on top of.

# ---------------------------------------------------------------------------
# Stage: "deps" — shared base. Installs ALL dependencies (incl.
# devDependencies like typescript, tsx, drizzle-kit). Both the dev stage and
# the prod builder stage start from here so the install step isn't repeated.
# ---------------------------------------------------------------------------
FROM node:24-alpine AS deps

WORKDIR /app

# Copy only the files needed to install dependencies first.
# Docker caches each layer — if package*.json don't change between builds,
# this layer (and the npm ci below) is reused instead of re-run.
COPY package.json package-lock.json ./

# npm ci = clean install strictly from package-lock.json (reproducible,
# faster than npm install, fails loudly if lockfile and package.json disagree).
RUN npm ci

# ---------------------------------------------------------------------------
# Stage: "dev" — target for local development.
# Runs the TypeScript source directly via `tsx watch` (same as
# `npm run dev`), instead of compiling with tsc first. Paired with
# docker-compose.yml's bind mount, which maps your host source into this
# container so edits are picked up live — that's why there's no COPY of
# source code here at all; it arrives at runtime via the bind mount.
# ---------------------------------------------------------------------------
FROM deps AS dev

# an open port means an application is listening on that port —
# opportunities for malicious actors to attack the application, so only
# expose what's actually needed.
EXPOSE 3000

CMD ["npx", "tsx", "watch", "--env-file=.env", "src/server.ts"]

# ---------------------------------------------------------------------------
# Stage: "builder" — compiles the app for production.
# Starts from "deps" (already has devDependencies installed), copies in the
# rest of the source, and runs tsc. Nothing in this stage ships on its
# own — it's a scratch workspace the "runner" stage below pulls files out of.
# ---------------------------------------------------------------------------
FROM deps AS builder

# Copy the rest of the source code (and drizzle/ migration SQL — see below)
COPY . .

# Compile TypeScript -> JavaScript (runs "tsc", outputs to ./dist per tsconfig.json).
RUN npm run build

# ---------------------------------------------------------------------------
# Stage: "runner" — target for production.
# Starts from a totally FRESH node:24-alpine layer — none of "deps" or
# "builder"'s filesystem carries over automatically. Only what we explicitly
# COPY --from=builder makes it in. Result: no TypeScript compiler, no
# devDependencies, no .ts source files — smaller image, smaller attack surface.
# ---------------------------------------------------------------------------
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

# Install ONLY production dependencies this time (no typescript/tsx/drizzle-kit)
RUN npm ci --omit=dev

# Pull the compiled output out of the builder stage.
# Nothing else from that stage (node_modules with devDeps, src/*.ts) comes along.
COPY --from=builder /app/dist ./dist

# drizzle-kit needs the migration SQL files + its config at runtime to apply
# migrations against a database — these are small, checked-in files, not
# build artifacts, so they're copied directly (not from the builder stage).
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# Document which port the app listens on (informational only —
# does NOT actually publish the port; that happens with `docker run -p`
# or compose's `ports:`)

# TBD: in aws session, we'll talk abt more ports to be opened
EXPOSE 3000

# generally containers run as root (superuser/admin) by default, which is
# more privilege than the app needs. node:alpine ships a "node" user already.
# Run as a non-root user (best practice, limits the blast radius of a compromise)
USER node

# Default command when the container starts: run the compiled server.
# (equivalent of `npm start`, but without --env-file — env vars are passed
# in with `docker run -e` / --env-file / compose's `environment:` instead)
CMD ["node", "dist/server.js"]
