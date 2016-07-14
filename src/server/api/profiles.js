'use strict'
var config = require('config');

let loadUserProfile = {
    method: 'POST',
    path: '/api/profile/load',
    handler: function (req, res) {
        res({ userProfile: { username: 'test', name: 'test user'}});
    }
}

module.exports = {
    registerApi: function (server) {
        server.route(loadUserProfile);
    }
}