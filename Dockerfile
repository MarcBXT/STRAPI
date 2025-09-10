FROM keymetrics/pm2:14-slim

WORKDIR /usr/src/app

# `ps` is needed by PM2/Strapi, for process monitoring.
RUN command -v ps >/dev/null 2>&1 || ( apt-get update && apt-get install -y procps )

COPY . .

ARG api_url=http://localhost:1333
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV CATALOG_API_URL=${api_url}

RUN yarn install && yarn build

EXPOSE 1333

CMD [ "pm2-runtime", "start", "/usr/src/app/ecosystem.develop.config.js", "--env", "production" ]
