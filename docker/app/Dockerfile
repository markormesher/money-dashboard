FROM node:carbon
ARG NPM_FONT_AWESOME_TOKEN

WORKDIR /app

# dependencies
RUN git -c http.sslVerify=false clone https://github.com/vishnubob/wait-for-it.git
COPY package.json .yarnrc yarn.lock .npmrc ./
RUN yarn

# source code
COPY . ./

# build
ARG BUILD_TYPE=production
RUN if [ $BUILD_TYPE = development ]; then yarn build-dev; else yarn build; fi

# run
EXPOSE 3006
ENTRYPOINT ["./docker/app/docker-entrypoint.sh"]
CMD yarn start
