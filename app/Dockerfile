FROM node:carbon

WORKDIR /usr/src/app

# dependencies
RUN git -c http.sslVerify=false clone https://github.com/vishnubob/wait-for-it.git
COPY package.json .npmrc ./
RUN npm i

# source code
COPY . .

# compile
RUN npm run build

# run
EXPOSE 3000
CMD ["node", "./dist/app.js"]
