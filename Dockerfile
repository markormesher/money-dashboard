FROM node:carbon

WORKDIR /usr/src/app

# dependencies
RUN git -c http.sslVerify=false clone https://github.com/vishnubob/wait-for-it.git
COPY .yarnrc yarn.lock package.json ./
RUN yarn

# source code
COPY . .

# compile
RUN yarn build

# run
EXPOSE 3000
CMD ["yarn", "start"]
