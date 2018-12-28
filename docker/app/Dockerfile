FROM node:carbon
ARG NPM_FONT_AWESOME_TOKEN

WORKDIR /app

# dependencies
COPY package.json .yarnrc yarn.lock .npmrc ./
RUN yarn install

# source code
COPY . ./

# build
ARG BUILD_TYPE=production
RUN if [ $BUILD_TYPE = production ]; then yarn build; fi
RUN if [ $BUILD_TYPE = development ]; then yarn build-dev; fi

# run
EXPOSE 3006
ENTRYPOINT ["./docker/app/docker-entrypoint.sh"]
CMD yarn start
