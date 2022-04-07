FROM node:16.13.0

RUN mkdir -p /var/www/frontend/

WORKDIR /var/www/frontend/

COPY . .

RUN npm install

CMD ["npm", "start"]