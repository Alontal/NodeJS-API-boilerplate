# Node API boilerplate

This is a boilerplate project for an quick and lean nodejs server base on Express.
* the project contains basic and useful packages such as: 
- database connectors to mysql (with multiple pool connections) & mongoDB(with an easily extended baseClass).
- secure your api with helmet, express-rate-limit, json web token, etc.  
- sending emails with nodemailer.
- wrapper for creating crons easily.
- .env files for different environments.
- manage and whitelist CORS by environment
- ready user management and permissions for both Mysql & MongoDB.
- extensible swagger Api, spec and definitions.

## Getting Started

Install dependencies.

```
npm i
```

Then using Nodemon

```
nodemon
```

### Prerequisites

Please install Node with npm.

- [Nodejs](https://nodejs.org)

## Authors

- **Alon Tal** - _Initial work_ - [AlonTal](https://github.com/Alontal)
- **Omer Nitzan** - _Initial work_ - [omer2500](https://github.com/omer2500)

## License

This project is licensed under the MIT License
