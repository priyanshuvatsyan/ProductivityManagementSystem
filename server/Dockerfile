#server/Dockerfile

from node:18

workdir /app

copy package*.json ./
run npm install

copy . .

# Copy the environment file into the container
COPY .env .env

expose 5000

cmd ["npm","start"]