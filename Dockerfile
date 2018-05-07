FROM node:8

WORKDIR /hifumi
COPY . /hifumi

RUN npm install
EXPOSE 5432
CMD [ "npm", "start" ]
