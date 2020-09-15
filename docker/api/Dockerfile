FROM node:dubnium

WORKDIR /money-dashboard

# dependencies
COPY ./assets ./assets
COPY package.json .yarnrc yarn.lock ./
RUN yarn install

# source
COPY ./docker ./docker
COPY ./src/commons ./src/commons
COPY ./src/api ./src/api
COPY ./tsconfig.json ./tsconfig.api*.json ./

# build
ARG BUILD_TYPE=production
RUN if [ $BUILD_TYPE = production ]; then yarn build-api; fi
RUN if [ $BUILD_TYPE = development ]; then yarn build-api-dev; fi

# run
EXPOSE 3000
ENTRYPOINT ["./docker/api/docker-entrypoint.sh"]
CMD yarn start-api
