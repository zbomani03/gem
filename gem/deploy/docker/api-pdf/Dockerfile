FROM node:10.15.3 as BUILDER

WORKDIR /usr/src/app

COPY --from=artifactory.internal.granular.ag/agstudio-build:latest /usr/src/app /usr/src/app

WORKDIR /usr/src/app/api/pdf/

ARG ENVIRONMENT

RUN ["sh", "-c", "yarn build:$ENVIRONMENT"]

FROM node:alpine

COPY --from=BUILDER /usr/src/app/api/pdf/build /usr/src/app

EXPOSE 8080/tcp

ENTRYPOINT [ "node", "/usr/src/app/server.js" ]