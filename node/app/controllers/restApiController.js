const express = require("express");

const { asyncMiddleware } = require("../middleware");
const { responseHandler } = require("../util");
const { baseModelSQL } = require(".");

class RestApi {
  constructor(
    name,
    model = new baseModelSQL(),
    options = {
      baseRoute: "",
      get: {
        function: null,
        middleware: []
      },
      post: {
        function: null,
        middleware: []
      },
      put: {
        function: null,
        middleware: []
      },
      delete: {
        function: null,
        middleware: []
      }
    }
  ) {
    this.name = name;
    this.model = model;
    this.router = express.Router();
    this.baseRoute = options.baseRoute || "/";
    if (options.get) this.get = options.get;
    if (options.post) this.post = options.post;
    if (options.put) this.put = options.put;
    if (options.delete) this.delete = options.delete;
    return this.restApiRoutes();
  }

  // ADD new custom route
  registerRoute(
    route,
    routeFunction,
    options = { middleware: [], message: "", type: "get" }
  ) {
    this.router[options.type.toString().toLowerCase()](
      this.baseRoute.toString(),
      options.middleware,
      asyncMiddleware(async (req, res) => {
        const { query, params, body } = req;
        const { data } = body;
        try {
          const apiResponse = await routeFunction(data || query || params);
          return res.status(200).send(apiResponse);
        } catch (error) {
          const apiResponse = responseHandler(
            `${options.type} ${route} ${this.name}`,
            false,
            { error }
          );
          return res.status(500).send(apiResponse.message);
        }
      })
    );
    return this;
  }

  // GET
  restApiRoutes() {
    this.router.get(
      this.baseRoute.toString(),
      this.get.middleware,
      asyncMiddleware(async (req, res) => {
        const { query } = req;
        const { limit, order, options } = req.body; // TODO add limit && order to query
        try {
          const getQuery = query || (options && options.where);
          if (!getQuery) res.status(500).send("missing query || where");
          let response;
          if (this.get.function) {
            response = await this.get.function(getQuery);
          } else {
            response = await this.model.findOne({ where: getQuery });
          }
          return res.status(200).send(response);
        } catch (error) {
          const response = responseHandler(`/get ${this.name}`, false);
          return res.status(500).send(response);
        }
      })
    );
    // POST
    this.router.post(
      this.baseRoute.toString(),
      this.insert.middleware,
      asyncMiddleware(async (req, res) => {
        const { data } = req.body;
        try {
          let response;
          if (this.post.function) {
            response = await this.post.function(data.data, data.options);
          } else {
            response = await this.model.delete(data.data, data.options);
          }
          return res.status(200).send(response);
        } catch (error) {
          const response = responseHandler(
            `/delete ${this.name}`,
            false,
            error
          );
          return res.status(500).send(response);
        }
      })
    );
    // PUT
    this.router.put(
      this.baseRoute.toString(),
      this.update.middleware,
      asyncMiddleware(async (req, res) => {
        const { data } = req.body;
        try {
          let response;
          if (this.put.function) {
            response = await this.put.function(data.data, data.options);
          } else {
            response = await this.model.update(data.data, data.options);
          }
          return res.status(200).send(response);
        } catch (error) {
          const response = responseHandler(`/put ${this.name}`, false);
          return res.status(500).send(response);
        }
      })
    );
    // DELETE
    this.router.delete(
      this.baseRoute.toString(),
      this.delete.middleware,
      asyncMiddleware(async (req, res) => {
        const { where } = req.body;
        try {
          let response;
          if (this.delete.function) {
            response = await this.delete.function(where);
          } else {
            response = await this.model.delete(where);
          }
          return res.status(200).send(response);
        } catch (error) {
          const response = responseHandler(
            `/delete ${this.name}`,
            false,
            error
          );
          return res.status(500).send(response);
        }
      })
    );
  }
}
module.exports = RestApi;
