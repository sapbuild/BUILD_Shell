'use strict';
module.exports = {
    options: {
        port: process.env.PORT || 9000,
        hostname: '127.0.0.1'
    },

    dev: {
        options: { script: '<%= env.server %>/app.js', debug: true }
    },

    prod: {
        options: { script: 'dist/server/app.js' }
    }
};
