FROM node:carbon

WORKDIR /usr/src/app

# dependencies
RUN yarn config set "strict-ssl" false
COPY package.json yarn.lock ./
RUN yarn global add serve
RUN yarn

# source code
COPY . .

# compile
RUN yarn build

# run
EXPOSE 3000
CMD ["serve", "-s", "dist", "-p", "3000"]
