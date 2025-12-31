# --- Stage 1: Build Stage ---
# Use Node.js to compile the React code
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy dependency files first (optimizes Docker caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build the app
COPY . .
RUN npm run build

# --- Stage 2: Production Stage ---
# Use Nginx to serve the static files created in Stage 1
FROM nginx:stable-alpine AS production-stage

# Copy the build output from the build-stage to Nginx's html folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy a custom Nginx config if needed (to handle React Router 404s)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]