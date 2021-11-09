import React from 'react';
import { useSelector } from 'react-redux';

import "../components/CoinList.css";
import CoinMarketData from "../Api/CoinMarketData.json";
import Coinone from "../components/Coinone";

function CoinList({ one_coin }) {
    var coinMarket = useSelector((state) => state.Coin.marketNames.data);
    var symimg;
    CoinMarketData.find((coinchk) => {
        if (coinchk.symbol === one_coin[0].MainSym) {
            symimg = coinchk.imgsrc;
            return;
        }
    })

    /*
        var Priceplus = "";
        if (one_coin.binUSDT_start_per > 0) {
            Priceplus = "BINplus-per";
        } else {
            Priceplus = "BINminus-per";
        }*/
    /*
        var exchangeimg = "";
        if (one_coin.exchange === 'upbit')
            exchangeimg = CoinMarketData[0].imgsrc;
        else if (one_coin.exchange === 'bithumb')
            exchangeimg = CoinMarketData[1].imgsrc;
        else if (one_coin.exchange === 'binance')
            exchangeimg = CoinMarketData[2].imgsrc;
    */


    return (
        <div className='coin-container'>
            <div className="coin-row" >
                <div className='coin'>
                    <img src={symimg} />
                    <h1 classame="coin-data" >{one_coin[0].MainSym}

                        <div>{coinMarket[one_coin[0].MainSym].minExchange}</div>
                        <div>
                            ↓
                        </div>
                        <div>{coinMarket[one_coin[0].MainSym].maxExchange}</div>

                    </h1>


                </div>

                <div>{coinMarket[one_coin[0].MainSym].testper}</div>
                {
                    one_coin.map((one) => {
                        return <Coinone key={`one_sym_${one.sym}`} oneCoin={one} />
                    })
                }

            </div>

        </div>
    )
}

export default CoinList;
/*

<div className='coin-container'>
            <div className="coin-row" >
                <div className='coin'>
                    <img src={symimg} />
                    <h1>{one_coin_Sym}</h1>
                </div>

                <img className="exchange-img" src={exchangeimg} />

                <div className="coin-data coin-pair-one">

                    <p className="coin-price">
                        KRW-{one_coin.KrwPrice}
                    </p>


                    <p className="coin-price">
                        {one_coin.OriginPrice}
                    </p>

                </div>
            </div>
        </div>

*/


/*


*/