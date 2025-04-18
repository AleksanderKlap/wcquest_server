FROM node:22.14-alpine3.20
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build --verbose
RUN npm install prisma --global
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
