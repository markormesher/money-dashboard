FROM node:carbon

WORKDIR /usr/src/app

# dependencies
COPY package.json yarn.lock ./
RUN yarn global add serve
RUN yarn

# source code
COPY . .

# compile
RUN yarn build

# run
EXPOSE 3000
CMD ["serve", "-s", "build", "-p", "3000"]
