FROM node:carbon

WORKDIR /usr/src/app

# dependencies
RUN git -c http.sslVerify=false clone https://github.com/vishnubob/wait-for-it.git
COPY package.json .yarnrc yarn.lock ./
RUN yarn

# source code
COPY . ./

# compile
RUN yarn build

# run
# TODO: wait for postgres AND redis
EXPOSE 3000
CMD ["./wait-for-it/wait-for-it.sh", "-t", "10", "postgres:5432", "--", "yarn", "start"]
