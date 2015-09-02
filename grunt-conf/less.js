'use strict';
module.exports = {
    options: {
        paths: [ 'client' ]
    },
    dev: {
        options: {
            compress: false
        },
        files: {
            'dev/assets/style.css': [
                '<%= env.client %>/*.less',
                '<%= env.client %>/**/*.less',

                'client/**/*.less',
                '!client/**/node_modules/**/*.less',

                'node_modules/norman-*/**/*.less',
                '!node_modules/norman-*/node_modules/**/*.less'
            ]
        }
    }
};
