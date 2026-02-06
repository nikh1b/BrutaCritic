# Deployment Guide - BrutaCritic

This guide outlines how to deploy the BrutaCritic frontend.

## Option 1: Vercel (Recommended)
The easiest way to deploy this Vite/React app.

1.  **Push to GitHub/GitLab**.
2.  Login to [Vercel](https://vercel.com).
3.  Click **"Add New Project"** and select your repository.
4.  **Build Settings** (detected automatically):
    - Framework: Vite
    - Build Command: `npm run build`
    - Output Directory: `dist`
5.  Click **Deploy**.

## Option 2: Netlify
1.  Drag and drop the `dist` folder (created after running `npm run build`) into the Netlify Drop zone.
    - *OR*
2.  Connect to Git similar to Vercel.
    - Build Command: `npm run build`
    - Publish Directory: `dist`

## Option 3: Docker (Container)
If you prefer a self-hosted container.
Create a `Dockerfile` in the root:

```dockerfile
# Stage 1: Build
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t brutacritic .
docker run -p 8080:80 brutacritic
```

## Production Notes
- **Mock Data**: The current `PlatformVerifier` uses mock data. Connect actual API keys in `src/lib/engine/PlatformVerifier.ts` using `import.meta.env`.
- **Performance**: The video engine is client-side. Ensure asset sizes (fonts) are optimized suitable for your CDN.
