/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable indent */
module.exports = {
  swagger: "2.0",
  info: {
    version: "1.0.0",
    title: "Node-kit",
    description: "Documentation",
    "termsOfService": "http://swagger.io/terms/",
    contact: {
      name: "Alon",
      email: "alon.tal@icloud.com",
      github: "https://github.com/alontal"
    },
    license: {
      name: "No license",
      "url": "https://licenseUrl"
    }
  },
  externalDocs: {
    description: "Git Readme.md",
    url: "https://github.com/Alontal/NodeJS-api"
  },
  host:
    process.env.NODE_ENV === "production"
      ? process.env.APP_DOMAIN
      : "need to use ngrok.io",
  basePath: "/api",
  // "schemes": [
  //   "https"
  // ],
  consumes: ["application/json"],
  produces: ["application/json"],
  paths: {
    //verify email
    "/user/insert": require('./user/insert'),

    // Login

    "/user/login": require('./user/login'),
  },
  
  definitions: {
    User: {
      type: "object",
      required: {
        $ref: "#/definitions/User"
      },
      properties: {
        email: {
          type: "string",
          $ref: "#/definitions/Email"
        },
        password: {
          type: "object",
          $ref: "#/definitions/Password"
        },
        first_name: {
          type: "string"
        },
        last_name: {
          type: "string"
        },
        phone: {
          type: "number"
        },
        role: {
          type: "enum: ['owner', 'admin', 'customer', 'limited']"
        },
        terms: {
          type: "boolean"
        }
      }
    },
    Email: {
      type: "object",
      required: ["email"],
      properties: {
        email: {
          type: "string"
        }
      }
    },

    Password: {
      type: "object",
      required: ["password"],
      properties: {
        password: {
          type: "string"
        }
      }
    },

    Token: {
      type: "object",
      properties: {
        token: { type: "HS256" }
      }
    },

    "200": {
      type: "object",
      properties: {
        message: { type: "string" },
        data: { type: "new object" }
      }
    },
    "500": {
      type: "object",
      required: ["code", "message"],
      properties: {
        message: {
          type: "string",
          description: "error accord"
        }
      }
    },
    "403": {
      type: "object",
      required: ["code", "message"],
      properties: {
        auth: {
          type: "boolean",
          format: "string"
        },
        message: { type: "string" }
      }
    },
    LoginSuccess: {
      type: "object",
      required: ["token", "message"],
      properties: {
        token: {
          type: "boolean",
          format: "string"
        },
        message: { type: "string" }
      }
    }
  }
};

