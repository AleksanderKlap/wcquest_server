FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate dev --name init && npx prisma deploy && node dist/index.js"]