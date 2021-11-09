const proxy = require('http-proxy-middleware');

// src/setupProxy.js
module.exports = function (app) {
    app.use(
        proxy('/api', {
            target: 'https://api.kucoin.com/',
            changeOrigin: true
        })
    );
};