FROM node:current-alpine3.19 as fe-build
WORKDIR /app
COPY frontend/package.json .
RUN npm install
COPY frontend/ .
RUN npm run build 

CMD ["sh"]


FROM node:current-alpine3.19 as be-build
WORKDIR /app
COPY backend/package.json .
RUN npm install
COPY backend/ .


FROM node:current-alpine3.19 as prod
WORKDIR /app
COPY --from=be-build /app /app
COPY --from=be-build /app/node_modules /app/node_modules
COPY backend/package.json .
COPY --from=fe-build /app/dist/build /app/public
EXPOSE 3030
CMD ["npm", "run", "prod-linux"]