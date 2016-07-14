'use strict'
var config = require('config');
var monk = require('monk');
var db = monk(config.settings.mongo.connectionstring);

var getall = function (callback) {
    var collection = db.get('widgets');
    collection.find({}, function (err, widgets) {
        if (err) throw err;
        callback(widgets);
    });
}

var insert = function (widget, callback) {
    var collection = db.get('widgets');
    collection.insert({
        title: widget.title,
        description: widget.description
    }, function (err, widget) {
        if (err) throw err;
        callback(widget);
    })
}

var get = function (widgetid, callback) {
    var collection = db.get('widgets');
    collection.findOne({ _id: widgetid }, function (err, widget) {
        if (err) throw err;
        callback(widget);
    });
}

var update = function (widget, callback) {
    var collection = db.get('widgets');
    collection.update({
        _id: widget.id
    },
        {
            title: widget.title,
            description: widget.description
        }, function (err, widget) {
            if (err) throw err;
            callback(widget);
        });
}

var destroy = function (widgetid, callback) {

    var collection = db.get('widgets');
    collection.remove({ _id: widgetid }, function (err, widget) {
        if (err) throw err;
        callback(widget);
    });
}

module.exports = {
    "getall" : getall,
    "insert" : insert,
    "get" : get,
    "update" : update,
    "destroy" : destroy
}