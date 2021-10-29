import React from 'react';
import { useSelector } from 'react-redux';
import CoinList from '../components/CoinList';
import "../components/CoinList.css";
import CoinMarketData from "../Api/CoinMarketData.json";

function CoinContainer() {
    var coinTotal = useSelector((state) => state.Coin.marketNames);

    const upbitCoinList = Object.keys(coinTotal.data);
    const upbitimgsrc = CoinMarketData[0].imgsrc;
    const bithumbimgsrc = CoinMarketData[1].imgsrc;
    const binanceimgsrc = CoinMarketData[2].imgsrc;

    const binanceUsdt = coinTotal.data['USDT'];
    const BTCdata = coinTotal.data['BTC'];

    if (!binanceUsdt) return null;
    if (!coinTotal) return null;

    /*
        // if (parseFloat(coinTotal.data[next].totalminPer) < parseFloat(coinTotal.data[prev].totalminPer))
        upbitCoinList.sort((next, prev) => {
            if (parseFloat(coinTotal.data[next].totalminPer) < parseFloat(coinTotal.data[prev].totalminPer))
                return -1;
            else
                return 0;
        });
        */

    /*
        upbitCoinList.sort((next, prev) => {
            if (parseFloat(coinTotal.data[next].testper) > parseFloat(coinTotal.data[prev].testper))
                return -1;
            else
                return 0;
        });
    */
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


                    <img className="exchange-img" src={upbitimgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.upbitSym}
                        </p>
                        <p className="coin-price">
                            {BTCdata.upbitPrice}
                        </p>
                    </div>

                    <img className="exchange-img" src={upbitimgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.upbitUSDT}
                        </p>
                        <p className="coin-price">
                            {BTCdata.upbitUSDTPrice}
                        </p>
                    </div>


                    <img className="exchange-img" src={bithumbimgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.bithumbSym}
                        </p>
                        <p className="coin-price">
                            {BTCdata.bithumbPrice}
                        </p>
                    </div>


                    <img className="exchange-img" src={binanceimgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.binanUSDTSym}
                        </p>
                        <p className="coin-price">
                            {BTCdata.binanUSDTPrice}
                        </p>
                    </div>
                    <img className="exchange-img" src={binanceimgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.binanBNBSym}
                        </p>
                        <p className="coin-price">
                            {BTCdata.binanBNBPrice}
                        </p>
                    </div>
                </div>
            </div>
            {
                upbitCoinList.map((coinData) => {
                    if (!(coinData === 'USDT' || coinData === 'BTC'))
                        return <CoinList key={`coinlist-${coinData}`} one_coin={coinTotal.data[coinData]} one_coin_Sym={coinData} />
                })
            }
        </div>
    )
    //<CoinList coins={coinTotal.data} />
}

export default CoinContainer;