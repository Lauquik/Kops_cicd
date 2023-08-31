FROM node:alpine3.18
WORKDIR /app
COPY ./deployments/app .
COPY ./build ./build
RUN apk add --no-cache mongodb-tools
RUN npm install
EXPOSE 3000
CMD ["sh", "/app/db/import-data.sh"]
