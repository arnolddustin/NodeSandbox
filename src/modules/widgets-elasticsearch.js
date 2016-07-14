'use strict'
var config = require('config');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: config.settings.elasticsearch.host,
    log: 'trace'
});

client.ping({
    requestTimeout: Infinity,
    hello: "elasticsearch!"
}, function (error) {
    if (error) {
        console.trace('elastic search not responding at ' + config.settings.elasticsearch.host);
    } else {
        console.log('elastic search ok at ' + config.settings.elasticsearch.host);
    }
});

var getall = function (callback) {
    client.search({
        index: 'widgets',
        type: 'widget',
        body: {
            query: {
                match_all: {}
            }
        }
    })
        .then(function (body) {
            var results = [];
            body.hits.hits.forEach(function (element) {
                results.push({
                    _id: element._id,
                    title: element._source.title,
                    description: element._source.description
                });
            }, this);
            callback(results);
        }, function (error) {
            console.trace(error.message);
        });
}

var insert = function (widget, callback) {
    client.create({
        index: 'widgets',
        type: 'widget',
        body: {
            title: widget.title,
            description: widget.description
        }
    }, function (err, widget) {
        if (err) throw err;
        callback(widget);
    })
}

var get = function (widgetid, callback) {
    client.search({
        index: 'widgets',
        type: 'widget',
        body: {
            query: {
                match: {
                    _id: widgetid
                }
            }
        }
    })
        .then(function (body) {
            callback({
                _id: body.hits.hits[0]._id,
                title: body.hits.hits[0]._source.title,
                description: body.hits.hits[0]._source.description
            });
        }, function (error) {
            console.trace(error.message);
        });
}

var update = function (widget, callback) {
    client.update({
        index: 'widgets',
        type: 'widget',
        id: widget._id,
        body: {
            doc: {
                title: widget.title,
                description: widget.description
            }
        }
    }, function (error, response) {
        if (error) {
            console.trace(error.message);
        }
        callback(widget);
    });
}

var destroy = function (widgetid, callback) {

   client.delete({
        index: 'widgets',
        type: 'widget',
        id: widgetid,
    }, function (error, response) {
        if (error) {
            console.trace(error.message);
        }
        callback();
    });
}

module.exports = {
    "getall": getall,
    "insert": insert,
    "get": get,
    "update": update,
    "destroy": destroy
}