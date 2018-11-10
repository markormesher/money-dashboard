FROM node:carbon

ARG NPM_FONT_AWESOME_TOKEN
ENV NPM_FONT_AWESOME_TOKEN=$NPM_FONT_AWESOME_TOKEN

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
CMD ["yarn", "prod"]
