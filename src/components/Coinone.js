import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CoinMarketData from "../Api/CoinMarketData.json";
import "../components/CoinList.css";

function Coinone({ oneCoin }) {
    var exchangeImg = "";
    if (oneCoin.exchange === 'upbit') {
        exchangeImg = CoinMarketData[0].imgsrc;
    } else if (oneCoin.exchange === 'bithumb') {
        exchangeImg = CoinMarketData[1].imgsrc;
    } else if (oneCoin.exchange === 'binance') {
        exchangeImg = CoinMarketData[2].imgsrc;
    }

    return (
        <>
            <img className="exchange-img" src={exchangeImg} />

            <div className="coin-data" >
                <p>
                    {oneCoin.sym}
                </p>
                <p>
                    KRW-{oneCoin.KrwPrice}
                </p>
                <p>
                    {oneCoin.OriginPrice}
                </p>
            </div>
        </>
    )
}


export default Coinone;