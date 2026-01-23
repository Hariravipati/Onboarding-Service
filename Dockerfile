FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
COPY .env .
RUN npm run build
RUN npm ci --only=production

EXPOSE 3001

CMD ["npm", "run", "start:prod"]