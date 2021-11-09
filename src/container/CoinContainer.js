import React from 'react';
import { useSelector } from 'react-redux';
import CoinList from '../components/CoinList';
import "../components/CoinList.css";
import CoinMarketData from "../Api/CoinMarketData.json";

function CoinContainer() {
    var coinTotal = useSelector((state) => state.Coin.marketNames);

    var TOPcoinTotalmain = useSelector((state) => state.Coin.TOPmarketNames);
    //console.log(TOPcoinTotalmain);
    const TOPcoinTotal = Object.keys(TOPcoinTotalmain);

    const binanceUsdt = coinTotal.data['USDT'];
    const BTCdata = coinTotal.data['BTC'];


    if (!TOPcoinTotalmain) return null;
    if (!binanceUsdt) return null;
    if (!coinTotal) return null;

    TOPcoinTotalmain.sort((next, prev) => {
        var nextsym = next[0].MainSym;
        var prevsym = prev[0].MainSym;

        if (parseFloat(coinTotal.data[nextsym].testper) > parseFloat(coinTotal.data[prevsym].testper)) {
            return -1;
        }
        else
            return 0;
    });


    return (
        <div>
            <div className='coin-container'>
                <div className="coin-row" >
                    <img className="exchange-img" src={CoinMarketData[0].imgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {binanceUsdt.upbitUSDT}
                        </p>
                        <p className="coin-price">
                            {binanceUsdt.upbitUSDTPrice}
                        </p>
                    </div>


                    <img className="exchange-img" src={CoinMarketData[0].imgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.upbitSym}
                        </p>
                        <p className="coin-price">
                            {BTCdata.upbitPrice}
                        </p>
                    </div>

                    <img className="exchange-img" src={CoinMarketData[0].imgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.upbitUSDT}
                        </p>
                        <p className="coin-price">
                            {BTCdata.upbitUSDTPrice}
                        </p>
                    </div>


                    <img className="exchange-img" src={CoinMarketData[1].imgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.bithumbSym}
                        </p>
                        <p className="coin-price">
                            {BTCdata.bithumbPrice}
                        </p>
                    </div>


                    <img className="exchange-img" src={CoinMarketData[2].imgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.binanUSDTSym}
                        </p>
                        <p className="coin-price">
                            {BTCdata.binanUSDTPrice}
                        </p>
                    </div>
                    <img className="exchange-img" src={CoinMarketData[2].imgsrc} />
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
                TOPcoinTotalmain.map((one_coin) => {
                    return <CoinList key={`cccoinlist__${one_coin[0].MainSym}`} one_coin={one_coin} />;
                })
            }
        </div>
    )
}

export default CoinContainer;
