FROM node:carbon
ARG NPM_FONT_AWESOME_TOKEN

WORKDIR /app

# dependency: wait-for-it script
RUN git -c http.sslVerify=false clone https://github.com/vishnubob/wait-for-it.git

# dependency: node modules
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
