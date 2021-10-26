import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CoinList from '../components/CoinList';
import "../components/CoinList.css";
import CoinMarketData from "../Api/CoinMarketData.json";

function CoinContainer() {
    var coinTotal = new Object();
    coinTotal = useSelector((state) => state.Coin.marketNames);

    const upbitCoinList = Object.keys(coinTotal.data);
    const upbitimgsrc = CoinMarketData[0].imgsrc;
    const bithumbimgsrc = CoinMarketData[1].imgsrc;
    const binanceimgsrc = CoinMarketData[2].imgsrc;

    const binanceUsdt = coinTotal.data['USDT'];


    if (!binanceUsdt) return null;
    if (!coinTotal) return null;


    upbitCoinList.sort((next, prev) => {
        if (parseFloat(coinTotal.data[next].upbitPrice) > parseFloat(coinTotal.data[prev].upbitPrice)) {
            return -1;
        } else
            return 0;
    });



    return (

        <div>
            <div className='coin-container'>
                <div className="coin-row" >
                    <img className="exchange-img" src={upbitimgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {binanceUsdt.upbitUSDT}
                        </p>
                        <p className="coin-price">
                            {binanceUsdt.upbitUSDTPrice}
                        </p>
                    </div>

                </div>
            </div>
            {
                upbitCoinList.map((coinData) => {
                    if (coinData !== 'USDT')
                        return <CoinList key={`coinlist-${coinData}`} one_coin={coinTotal.data[coinData]} one_coin_Sym={coinData} />
                })
            }
        </div>
    )
    //<CoinList coins={coinTotal.data} />
}

export default CoinContainer;