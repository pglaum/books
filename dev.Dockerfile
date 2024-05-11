FROM node:22-alpine

RUN apk add --no-cache git

RUN mkdir /nuxt
WORKDIR /nuxt

COPY .docker/entrypoint.nuxt.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT [ "docker-entrypoint" ]
CMD yarn dev
