'use strict'
var config = require('config');
var monk = require('monk');

var monk = require('monk');
// var db = monk('192.168.99.100:32769/vidzy');
var db = monk(config.settings.mongo.connectionstring);

let getall = {
    method: 'GET',
    path: '/api/videos',
    handler: function (req, res) {
        var collection = db.get('videos');
        collection.find({}, function (err, videos) {
            if (err) throw err;
            res(videos);
        });
    }
}

let post = {
    method: 'POST',
    path: '/api/videos',
    handler: function (req, res) {
        var collection = db.get('videos');
        collection.insert({
            title: req.payload.title,
            description: req.payload.description
        }, function (err, video) {
            if (err) throw err;
            res(video);
        })
    }
}

let get = {
    method: 'GET',
    path: '/api/videos/{id}',
    handler: function (req, res) {
        var collection = db.get('videos');
        collection.findOne({ _id: req.params.id }, function (err, video) {
            if (err) throw err;
            res(video);
        });
    }
}

let put = {
    method: 'PUT',
    path: '/api/videos/{id}',
    handler: function (req, res) {
        var collection = db.get('videos');
        collection.update({
            _id: req.params.id
        },
            {
                title: req.payload.title,
                description: req.payload.description
            }, function (err, video) {
                if (err) throw err;
                res(video);
            });
    }
}

let destroy = {
    method: 'DELETE',
    path: '/api/videos/{id}',
    handler: function (req, res) {
        var collection = db.get('videos');
        collection.remove({ _id: req.params.id }, function (err, video) {
            if (err) throw err;
            res(video);
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