const proxy = require('http-proxy-middleware');

// src/setupProxy.js
module.exports = function (app) {
    app.use(
        proxy('/api', {
            target: 'https://api.kucoin.com/', // 비즈니스 서버 URL 설정
            changeOrigin: true
        })
    );
};