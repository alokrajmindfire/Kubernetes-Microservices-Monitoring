FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["npm", "start"]