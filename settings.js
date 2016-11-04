'use strict';

module.exports = {
    'url_dev': 'http://localhost:8443/',
    'url_prod': '',
    'url_db': 'mongodb://localhost:27017/test', //'url_db': 'mongodb://localhost:27017/test',  
    'port': 8443,
    'options': {
        server: {
            socketOptions: { keepAlive: 1 }
        }
    }
}