####
# Build stage
####
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Não definir REACT_APP_API_URL: em produção usa URL relativa (nginx proxy)

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

####
# Runtime stage with nginx
####
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx content
RUN rm -rf ./*

# Copy built application from build stage
COPY --from=build /app/build .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
