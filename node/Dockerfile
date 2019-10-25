FROM node:latest

RUN mkdir /src

RUN npm install pm2 -g

# Define working directory
WORKDIR /src
COPY ./node /src/

#Install dependencies
RUN npm install

ENV NODE_ENV=${NODE_ENV}
# Expose port
EXPOSE  ${PORT}

# Run app using nodemon
CMD ["pm2-runtime","/src/server.js","-i","max"]
# CMD ["node","/src/server.js"]
