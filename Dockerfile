FROM node:alpine3.18
WORKDIR /app
COPY ./deployments/app .
COPY ./build ./build
RUN npm install
EXPOSE 3000
CMD ["node", "/app/app.js"]
