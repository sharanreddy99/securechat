FROM node:12-alpine
WORKDIR /app/backend
COPY package.* ./
RUN npm install
COPY . /app/backend/ 
WORKDIR /app/backend/src
RUN ls
CMD ["npm","start"]