FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#Install Pm2
RUN npm install pm2 -g

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

CMD ["pm2-runtime", "server.js"]

# Our Nginx container will forward HTTP traffic to containers of 
# this image via port 3000.
EXPOSE 3000