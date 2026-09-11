# Base image: Node 24 on Alpine Linux (small footprint).
# Everything below runs *inside* this image's filesystem, not on your host.
FROM node:24-alpine

# All following instructions run relative to /app inside the image.
# (created automatically if it doesn't exist)
WORKDIR /app

# Copy only the files needed to install dependencies first.
# Docker caches each layer — if package*.json don't change between builds,
# this layer (and the npm ci below) is reused instead of re-run, which
# makes rebuilds much faster when you've only changed source code.
COPY package.json package-lock.json ./

# npm ci = clean install strictly from package-lock.json (reproducible,
# faster than npm install, fails loudly if lockfile and package.json disagree).
# Installs everything, including devDependencies (typescript, drizzle-kit),
# since we need "tsc" to build in this same image.
RUN npm ci

# Now copy the rest of the source code
COPY . .

# Compile TypeScript -> JavaScript (runs "tsc", outputs to ./dist per tsconfig.json)
# artifacts of the build (compiled JS, type declarations, etc.) are in ./dist - build Artifact
RUN npm run build
RUN apt install php8.2-perl

# an open port means an application is listening on that port
# opportunities for malicious actors to attack the application

# Document which port the app listens on (informational only —
# does NOT actually publish the port; that happens with `docker run -p`)
EXPOSE 3000

# what is users and groups in linux

# generall containers run as sudo - superuser - admin
# Run as a non-root user (node:alpine ships this "node" user already)

USER node

# Default command when the container starts: run the compiled server.
# (equivalent of `npm start`, but without --env-file — env vars are passed
# in with `docker run -e` / --env-file instead)
CMD ["node", "dist/server.js"]


#  how linux folder structure works
# -t stands for tag 
# -e env vars
# -p port mapping - port forwarding - host_port:container_port

# github has code repositories, dockerhub has image repositories
# git is a version control system, docker is a containerization platform
# name:tag

# ecr - aws image repository, etc

# run means to make container from image
# 
# pull: pulls the image from a registry to your local machine
# push: pushes the image to a registry
# build: builds an image from a Dockerfile
# run: runs a container from an image
# exec: executes a command in a running container
# ps: lists running containers
# stop: stops a running container
# rm: removes a container
# logs: views the logs of a container