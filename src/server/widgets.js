'use strict'
var config = require('config');
var monk = require('monk');

var monk = require('monk');
var db = monk(config.settings.mongo.connections[0].connectionstring);

let getall = {
    method: 'GET',
    path: '/api/widgets',
    handler: function (req, res) {
        var collection = db.get('widgets');
        collection.find({}, function (err, widgets) {
            if (err) throw err;
            res(widgets);
        });
    }
}

let post = {
    method: 'POST',
    path: '/api/widgets',
    handler: function (req, res) {
        var collection = db.get('widgets');
        collection.insert({
            title: req.payload.title,
            description: req.payload.description
        }, function (err, widget) {
            if (err) throw err;
            res(widget);
        })
    }
}

let get = {
    method: 'GET',
    path: '/api/widgets/{id}',
    handler: function (req, res) {
        var collection = db.get('widgets');
        collection.findOne({ _id: req.params.id }, function (err, widget) {
            if (err) throw err;
            res(widget);
        });
    }
}

let put = {
    method: 'PUT',
    path: '/api/widgets/{id}',
    handler: function (req, res) {
        var collection = db.get('widgets');
        collection.update({
            _id: req.params.id
        },
            {
                title: req.payload.title,
                description: req.payload.description
            }, function (err, widget) {
                if (err) throw err;
                res(widget);
            });
    }
}

let destroy = {
    method: 'DELETE',
    path: '/api/widgets/{id}',
    handler: function (req, res) {
        var collection = db.get('widgets');
        collection.remove({ _id: req.params.id }, function (err, widget) {
            if (err) throw err;
            res(widget);
        });
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