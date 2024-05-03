FROM node:16.14.2-alpine

WORKDIR /money-dashboard

COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean

COPY ./src ./src
COPY ./tsconfig.json ./webpack.config.js ./

ARG BUILD_TYPE=production
RUN if [ $BUILD_TYPE = production ]; then yarn build; fi
RUN if [ $BUILD_TYPE = development ]; then yarn build-dev; fi

EXPOSE 3000
CMD yarn start
