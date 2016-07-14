'use strict'
var config = require('config');
var widgets = require('../../modules/widgets-elasticsearch');

let getall = {
    method: 'GET',
    path: '/api/widgets',
    handler: function (req, res) {
        widgets.getall(res);
    }
}

let post = {
    method: 'POST',
    path: '/api/widgets',
    handler: function (req, res) {
        widgets.insert(req.payload, res);
    }
}

let get = {
    method: 'GET',
    path: '/api/widgets/{id}',
    handler: function (req, res) {
        widgets.get(req.params.id, res);
    }
}

let put = {
    method: 'PUT',
    path: '/api/widgets/{id}',
    handler: function (req, res) {
        req.payload.id = req.params.id;
        widgets.update(req.payload, res);
    }
}

let destroy = {
    method: 'DELETE',
    path: '/api/widgets/{id}',
    handler: function (req, res) {
        widgets.destroy(req.params.id, res);
    }
};

module.exports = {
    registerApi: function (server) {
        server.route(getall);
        server.route(get);
        server.route(post);
        server.route(put);
        server.route(destroy);
    }
}