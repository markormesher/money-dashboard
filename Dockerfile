FROM node:carbon
ARG NPM_FONT_AWESOME_TOKEN

WORKDIR /usr/src/app

# dependencies
RUN git -c http.sslVerify=false clone https://github.com/vishnubob/wait-for-it.git
COPY package.json .yarnrc yarn.lock .npmrc ./
RUN yarn

# source code
COPY . ./

# compile
RUN yarn build

# run
EXPOSE 3000
CMD ["yarn", "start"]
