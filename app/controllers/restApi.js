const express = require('express');

const { asyncMiddleware } = require('../middleware');
const { responseHandler } = require('../util');
const BaseModel = require('./baseControllerSql');

class RestApi {
  constructor(
    name,
    model = new BaseModel(),
    options = {
      baseRoute: '',
      get: {
        function: null,
        middleware: []
      },
      insert: {
          function: null,
          middleware: []
      },
      delete: {
        function: null,
        middleware: []
      },
      update: {
        function: null,
        middleware: []
      },
    }
  ) {
    this.name = name;
    this.model = model;
    this.router = express.Router();
    this.baseRoute = options.baseRoute || '/';
    if (options.get.function) this.get = options.get;
    if (options.insert.function) this.insert = options.insert;
    if (options.delete.function) this.delete = options.delete;
    if (options.update.function) this.update = options.update;
    return this.restApiRoutes();
  }

  registerRoute(route, routeFunction, options = { middleware: [], message: '', type: 'get' }) {
    this.router[options.type.toString().toLowerCase()](
      this.baseRoute.toString(),
      options.middleware,
      asyncMiddleware(async (req, res) => {
        const { query, params, body } = req;
        const { data } = body;
        try {
          const response = await routeFunction(query || data || params);
          return res.status(200).send(
            responseHandler(`${options.type} ${this.name}`, response || false, {
              data: { response, _message: options.message }
            })
          );
        } catch (error) {
          return res.status(500).send(responseHandler(`${options.type} ${route} ${this.name}`, false));
        }
      })
    );
    return this;
  }

  restApiRoutes() {
    this.router.get(
      this.baseRoute.toString(),
      this.get.middleware,
      asyncMiddleware(async (req, res) => {
        const { query } = req;
        const { limit, order, options } = req.body;
        try {
          const response = this.get.function
            ? await this.get.function(query || options.where)
            : await this.model.getMany({}, { limit, order }, options);
          return res.status(200).send(responseHandler(`/get ${this.name}`, true, { data: response }));
        } catch (error) {
          return res.status(500).send(responseHandler(`/get ${this.name}`, false));
        }
      })
    );
    this.router.post(
      this.baseRoute.toString(),
      this.insert.middleware,
      asyncMiddleware(async (req, res) => {
        const { data, where } = req.body;
        try {
          const response = this.insert.function
            ? await this.insert.function(data, where)
            : await this.model.insert(data);
          return res
            .status(200)
            .send(
              responseHandler(
                `/post ${this.name}`,
                response.status,
                response.status ? { data: response } : { error: response }
              )
            );
        } catch (error) {
          return res.status(500).send(responseHandler(`/post ${this.name}`, false, error));
        }
      })
    );
    this.router.delete(
      this.baseRoute.toString(),
      this.delete.middleware,
      asyncMiddleware(async (req, res) => {
        const { where } = req.body;
        try {
          const response = this.delete.function
            ? await this.delete.function(where)
            : await this.model.delete(where);
          return res.status(200).send(response);
        } catch (error) {
          return res.status(500).send(responseHandler(`/delete ${this.name}`, false));
        }
      })
    );
    this.router.put(
      this.baseRoute.toString(),
      this.update.middleware,
      asyncMiddleware(async (req, res) => {
        const { where, data } = req.body;
        try {
          const response = (await this.update.function(where, data)) || (await this.model.update(where, data));
          return res.status(200).send(response);
        } catch (error) {
          return responseHandler(`/put ${this.name}`, false);
        }
      })
    );
    return this;
  }
}
module.exports = RestApi;