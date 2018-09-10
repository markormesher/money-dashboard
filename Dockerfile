FROM node:carbon

WORKDIR /usr/src/app

# dependencies
COPY package.json .yarnrc yarn.lock ./
RUN yarn

# source code
COPY . ./

# compile
RUN yarn build

# run
EXPOSE 3000
CMD ["yarn", "start"]
