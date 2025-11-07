# Deployment Guide: Google Cloud Run

**Document Status:** Initial Draft - 2024-07-29

This document provides a step-by-step guide to successfully containerize and deploy this Vite + React application as a Cloud Run service.

---

## 1. Understanding the "Container Failed to Start" Error

When you deploy to Cloud Run, it expects your application to start a web server that listens for HTTP traffic on a specific port. Cloud Run tells your application which port to use by setting an environment variable called `PORT` (which defaults to `8080`).

The error message `The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable...` means that:
1.  Your container was successfully built.
2.  Cloud Run started the container.
3.  Your application **did not** start a web server on port `8080` within the allowed time.
4.  Because the health check failed, Cloud Run terminated the container and marked the deployment as failed.

A standard `npm run build` command for a React project only creates static files (`index.html`, JS, CSS). It does **not** include a web server. We need to add one.

---

## 2. Solution: Adding a Production Server

We will use `serve`, a simple and powerful static file server, to serve our application's build artifacts.

### Step 1: Add the `serve` Package

First, we need to add `serve` as a project dependency.

```bash
npm install serve
```

### Step 2: Create a Production `start` Script

Next, we need to add a `start` script to `package.json`. This command tells `serve` to serve the contents of the `dist` folder (where the build output is) and to listen on the port specified by the `PORT` environment variable.

In your `package.json`, add the `"start"` script:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "start": "serve -s dist -l ${PORT:-8080}", // This is the new script
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview"
},
```
- `serve`: Runs the server.
- `-s dist`: Serves the `dist` directory and handles single-page application (SPA) routing correctly.
- `-l ${PORT:-8080}`: Listens on the `PORT` environment variable provided by Cloud Run, falling back to `8080` for local testing.

### Step 3: Create a `Dockerfile`

This file tells Google Cloud how to build a container image for your application. We will use a multi-stage build, which is a best practice for creating small and secure images.

Create a new file named `Dockerfile` in the root of your project with the following content:

```dockerfile
# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Create the final, lightweight production image
FROM node:20-alpine
WORKDIR /app

# Copy dependencies needed for the server from the build stage
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev

# Copy the built static files from the build stage
COPY --from=build /app/dist ./dist

# Expose the port the app will run on
EXPOSE 8080

# The command to start the production server
CMD ["npm", "start"]
```

### Step 4: Create a `.dockerignore` file

To ensure a fast and clean build, create a `.dockerignore` file in your project root to exclude unnecessary files from the container.

```
# Dependency directories
node_modules

# Build output
dist
.vite

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Misc
.env
.DS_Store
```

---

## 3. Redeploying to Cloud Run

With these files in place, you can now redeploy your application to Cloud Run. The Cloud Build process will automatically detect the `Dockerfile` and use it to build and deploy your container correctly. The new container will start the `serve` process, which will listen on port `8080` as required, and the deployment will succeed.

---

## 4. Environment Variables

For the application to function correctly, it needs to communicate with Google's Generative AI services. This communication is authenticated using an API key.

### `API_KEY` (Required)

-   **Purpose:** This variable holds your Google Generative Language API key. The application uses this key to make authenticated requests to the Gemini API for all AI-powered features, including deck generation and image creation.
-   **Format:** It should be the string value of the API key provided by Google AI Studio.
-   **How to set:** When deploying to Google Cloud Run or any other hosting service, you must set this environment variable.
    -   In Cloud Run, you can set this under the "Variables & Secrets" tab when creating or editing a revision.
    -   **Variable Name:** `API_KEY`
    -   **Value:** `your_actual_api_key_here`

The application code is already configured to read this key from `process.env.API_KEY`. Without this variable, all calls to the Gemini API will fail.
