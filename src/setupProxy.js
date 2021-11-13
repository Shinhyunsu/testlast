const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api/v4/spot/tickers', createProxyMiddleware({
            target: 'https://api.gateio.ws',
            changeOrigin: true
        })
    )

    app.use(
        '/api/v1', createProxyMiddleware({
            target: 'https://api.kucoin.com',
            changeOrigin: true
        })
    )
    app.use(///market/tickers
        '/market/tickers', createProxyMiddleware({
            target: 'https://api.huobi.pro',
            changeOrigin: true
        })
    )

    app.use(
        '/ticker', createProxyMiddleware({
            target: 'https://api.coinone.co.kr',
            changeOrigin: true
        })
    )
};


// https://api.coinone.co.kr/ticker?currency=all


