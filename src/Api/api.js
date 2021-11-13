import axios from "axios";
import { useSelector } from 'react-redux';
import CoinMarketData from "../Api/CoinMarketData.json";
import { call, put, select, flush, delay } from "redux-saga/effects";
import cors from 'cors';

export const gateioApi = {
    getMarketCodes: () =>
        axios.get("/api/v4/spot/tickers")
};

export const huobiApi = {
    getMarketCodes: () =>
        axios.get("/market/tickers")
};

export const kucoinApi = {
    getMarketCodes: () =>
        axios.get("/api/v1/market/allTickers")
};

export const coinoneApi = {
    getMarketCodes: () =>
        axios.get("/ticker?currency=all")
};

export const upbitoinApi = {
    getMarketCodes: () =>
        axios.get("https://api.upbit.com/v1/market/all?isDetails=false"),
    getMarketPriceCodes: () => {
        return;
    }
};

export const binancecoinApi = {
    getMarketCodes: () =>
        axios.get("https://api1.binance.com/api/v3/ticker/price")
};


export const bithumbcoinApi = {
    getKRWMarketCodes: () =>
        axios.get("https://api.bithumb.com/public/ticker/ALL_KRW"),
    getBTCMarketCodes: () =>
        axios.get("https://api.bithumb.com/public/ticker/ALL_BTC")
};

