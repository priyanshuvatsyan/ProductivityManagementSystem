# client/Dockerfile

from node:18

workdir /app

copy package*.json ./
run npm install

copy . .

run npm run build

# Use nginx to serve the production build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]