FROM node:10.15.3 as BUILDER

WORKDIR /usr/src/app

COPY --from=artifactory.internal.granular.ag/agstudio-build:latest /usr/src/app /usr/src/app

WORKDIR /usr/src/app/app/agstudio/

ARG ENVIRONMENT

RUN ["sh", "-c", "yarn build:$ENVIRONMENT"]

FROM nginx:alpine

COPY --from=BUILDER /usr/src/app/app/agstudio/build /etc/nginx/html/
COPY --from=BUILDER /usr/src/app/deploy/docker/monorepo/nginx.conf /etc/nginx/nginx.conf
COPY --from=BUILDER /usr/src/app/deploy/docker/app-agstudio/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

ENTRYPOINT ["nginx","-g","daemon off;"]