FROM node:latest
MAINTAINER egor@vorozhtsov.com.ru

EXPOSE 3000

RUN apt-get update \
    && apt-get install -y \
        build-essential g++ flex bison gperf ruby perl \
        libsqlite3-dev libfontconfig1-dev libicu-dev libfreetype6 libssl-dev \
        libpng-dev libjpeg-dev python libx11-dev libxext-dev

RUN mkdir -p /usr/src/app
RUN groupadd -r prerender && useradd -r -g prerender -d /usr/src/app prerender
RUN chown prerender:prerender /usr/src/app

USER prerender
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

CMD [ "npm", "start" ]

