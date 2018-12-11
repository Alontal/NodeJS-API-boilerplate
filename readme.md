# Starter Nodejs with Mysql & Winston & JWT.

## ready to use backend server with tools needed to:
1. use production settings.
2. logging logs with winston logger.
3. integration to MySQL 
4. JWT api ready to use
5. sql script to create users table 
6. debug setting with nodemon in launch.json 

## install:

``` $ npm i ``` 

## run:
in dev mode: ``` $ npm start```
in prod mode: ``` $ npm start:prod ```

# Environment settings
 
1. open mysql server and provide connection details in config file.
2. make sure that .env files are not commented out in .gitignore file (they are on the repository for example only) and pushed into git. ** they hold you secret details! **


### packages: 
   - express : ...to make node app 
   - bcrypt-nodejs : for encryption passwords https://www.npmjs.com/package/bcrypt-nodejs
   - cors: manage cross origin request to app https://www.npmjs.com/package/cors
   - dotenv : manage env variables  https://www.npmjs.com/package/dotenv
   - jsonwebtoken : An implementation of JSON Web Tokens. https://www.npmjs.com/package/jsonwebtoken
   - lodash : for make things easier sometimes https://lodash.com/
   - mkdirp : to create new directories https://www.npmjs.com/package/mkdirp
   - promise-mysql : handle mysql connections https://www.npmjs.com/package/promise-mysql
   - uuid : to create user with new uuid https://www.npmjs.com/package/uuid
   - winston : manage logging our app  https://github.com/winstonjs/winston
   - nodemon: see  settings https://www.npmjs.com/package/nodemon
   - node-schedule: see  settings https://github.com/node-schedule/node-schedule#readme
   - nodemailer: see  settings https://nodemailer.com/
   - mongoose: see http://mongoosejs.com  
   - request-promise-native see https://github.com/request/request-promise-native#readme
   - moment see: http://momentjs.com