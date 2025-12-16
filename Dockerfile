FROM node:24.11.1
WORKDIR /app
COPY package.json .
COPY prisma ./prisma
ARG NODE_ENV
RUN npm i
COPY . .
EXPOSE 3000
CMD [ "npm","run","dev" ]


