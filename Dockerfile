# First part, build the app
FROM node:23-alpine as fleetsim-ui-builder
LABEL stage=fleetsim-ui-builder

COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile

COPY ./ .

RUN yarn build

# Second part, create a config at boostrap via entrypoint and and serve it
FROM caddy/caddy:alpine

# JQ is used to convert from JSON string to json file in bash
RUN apk update
RUN apk add --no-cache jq

COPY --from=0 build/ .
COPY docker/Caddyfile /srv/Caddyfile
COPY docker/entrypoint.sh /entrypoint.sh
COPY docker/createJSONConfig.sh /createJSONConfig.sh

RUN chmod +x /entrypoint.sh
RUN chmod +x /createJSONConfig.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]

CMD ["caddy", "run", "--watch"]