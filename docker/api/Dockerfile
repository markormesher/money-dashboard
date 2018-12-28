FROM node:carbon

WORKDIR /money-dashboard

# dependencies
ARG NPM_FONT_AWESOME_TOKEN
COPY package.json .yarnrc yarn.lock .npmrc ./
RUN yarn install

# TODO: limit how much we copy here to reduce cache busting
# source code
COPY . ./

# build
ARG BUILD_TYPE=production
RUN if [ $BUILD_TYPE = production ]; then yarn build-api; fi
RUN if [ $BUILD_TYPE = development ]; then yarn build-api-dev; fi

# run
EXPOSE 3000
ENTRYPOINT ["./docker/api/docker-entrypoint.sh"]
CMD yarn start-api
