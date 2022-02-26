FROM node:dubnium

WORKDIR /money-dashboard

# dependencies
COPY ./private-packages ./private-packages
COPY package.json .yarnrc yarn.lock ./
RUN yarn install

# source
COPY ./docker ./docker
COPY ./src/commons ./src/commons
COPY ./src/client ./src/client
COPY ./tsconfig.json ./tsconfig.client*.json ./webpack.config.js ./

# build
ARG BUILD_TYPE=production
RUN if [ $BUILD_TYPE = production ]; then yarn build-client; fi
RUN if [ $BUILD_TYPE = development ]; then yarn build-client-dev; fi

# run
EXPOSE 3001
CMD yarn start-client
