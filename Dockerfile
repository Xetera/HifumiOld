FROM node:8 AS build
WORKDIR /src
ADD package.json ./
RUN npm install
EXPOSE 5432
CMD [ "npm", "start" ]
