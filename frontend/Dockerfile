# Stage 1: Build using Node
FROM node:18 AS build

WORKDIR /app

ARG VITE_SPRING_API_URL
ENV VITE_SPRING_API_URL=${VITE_SPRING_API_URL}

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve using NGINX
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
