FROM node:18

RUN mkdir /app

WORKDIR /app

COPY package*.json /app

RUN npm install 

COPY . /app


EXPOSE 5000
CMD ["node", "dynamic_admin.js"]

