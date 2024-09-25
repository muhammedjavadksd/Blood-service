FROM node:22.4.1-alpine
WORKDIR ./app/Blood
COPY .package*.json ./
COPY . .
RUN npm install
RUN npx tsc
CMD ["npm","start"]