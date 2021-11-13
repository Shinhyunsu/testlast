import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CoinMarketData from "../Api/CoinMarketData.json";

import "../components/CoinList.css";
function CoinList({ one_coin, one_coin_Sym }) {
    //const upbitCoinList = Object.keys(coin);
    const upbitimgsrc = CoinMarketData[0].imgsrc;
    const bithumbimgsrc = CoinMarketData[1].imgsrc;
    const binanceimgsrc = CoinMarketData[2].imgsrc;
    const huobiimgsrc = CoinMarketData[3].imgsrc;
    const gateioimgsrc = CoinMarketData[4].imgsrc;
    const coinoneimgsrc = CoinMarketData[5].imgsrc;
    const kucoinimgsrc = CoinMarketData[6].imgsrc;

    var symimg;
    CoinMarketData.find((coinchk) => {
        if (coinchk.symbol === one_coin_Sym) {
            symimg = coinchk.imgsrc;
            return;
        }
    })

    /*
        var BINplus = "";
        if (one_coin.binUSDT_start_per > 0) {
            BINplus = "BINplus-per";
        } else {
            BINplus = "BINminus-per";
        }
    
        var BTCplus = "";
        if (one_coin.binBTC_start_per > 0) {
            BTCplus = "BTCplus-per";
        } else {
            BTCplus = "BTCminus-per";
        }
    
        var USDTplus = "";
        if (one_coin.upbitUSDT_start_per > 0) {
            USDTplus = "USDTplus-per";
        } else {
            USDTplus = "USDTminus-per";
        }
    
    
        var upbitBTCSymplus = "";
        if (one_coin.upbitBTCSym_start_per > 0) {
            upbitBTCSymplus = "USDTplus-per";
        } else {
            UPBITBTCplus = "USDTminus-per";
        }
    
        var BINUSDplus = "";
        if (one_coin.binBUSD_start_per > 0) {
            BINUSDplus = "BINBUSDTplus-per";
        } else {
            BINUSDplus = "BINBUSDTminus-per";
        }
    
        var BITHUMBKRWplus = "";
        if (one_coin.bithumbKRW_start_per > 0) {
            BITHUMBKRWplus = "BITHUMBKRWplus-per";
        } else {
            BITHUMBKRWplus = "BITHUMBKRWminus-per";
        }*/

    return (
        <div className='coin-container'>
            <div className="coin-row" >
                <div className='coin'>
                    <img src={symimg} />
                    <h1>{one_coin_Sym}</h1>
                </div>
                <div>{one_coin.per}</div>
                {one_coin.upbitKRWSym ? <img className="exchange-img" src={upbitimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-one">
                    {one_coin.upbitKRWSym ?
                        <p className="coin-price">
                            {one_coin.upbitKRWSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.upbitKRWSym ?
                        <p className="coin-price">
                            K-{one_coin.calKoupbitKRW}
                        </p>
                        :
                        <span>
                        </span>
                    }
                    {one_coin.upbitKRWSym ?
                        <p >
                            {one_coin.with_calKoupbitKRW}%
                        </p> :
                        <span>

                        </span>
                    }
                </div>
                {one_coin.bithumbKRWSym ? <img className="exchange-img" src={bithumbimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-one">
                    {one_coin.bithumbKRWSym ?
                        <p className="coin-price">
                            {one_coin.bithumbKRWSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.bithumbKRWSym ?
                        <p className="coin-price">
                            K-{one_coin.calKobithumbKRW}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.bithumbKRWSym ?
                        <p >
                            {one_coin.with_calKobithumbKRW}%
                        </p> :
                        <span>

                        </span>
                    }
                </div>


                {one_coin.coinoneKRWSym ? <img className="exchange-img" src={coinoneimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-two">
                    {one_coin.coinoneKRWSym ?
                        <p className="coin-price">
                            {one_coin.coinoneKRWSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.coinoneKRWSym ?
                        <p className="coin-price">
                            {one_coin.coinoneKRWPrice}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.coinoneKRWSym ?
                        <p className="coin-price">
                            K-{one_coin.calKocoinoneKRW}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.coinoneKRWSym ?
                        <p >
                            {one_coin.with_calKocoinoneKRW}%
                        </p> :
                        <span>

                        </span>
                    }


                </div>

                {one_coin.upbitBTCSym ? <img className="exchange-img" src={upbitimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-two">
                    {one_coin.upbitBTCSym ?
                        <p className="coin-price">
                            {one_coin.upbitBTCSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.upbitBTCSym ?
                        <p className="coin-price">
                            {one_coin.upbitBTCPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.upbitBTCSym ?
                        <p className="coin-price">
                            K-{one_coin.calKoupbitBTC}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.upbitBTCSym ?
                        <p >
                            {one_coin.with_calKoupbitBTC}%
                        </p> :
                        <span>

                        </span>
                    }
                </div>
                {one_coin.bithumbBTC ? <img className="exchange-img" src={bithumbimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-two">
                    {one_coin.bithumbBTC ?
                        <p className="coin-price">
                            {one_coin.bithumbBTC}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.bithumbBTC ?
                        <p className="coin-price">
                            {one_coin.bithumbBTCPrice}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.bithumbBTC ?
                        <p className="coin-price">
                            K-{one_coin.calKobithumbBTC}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.bithumbBTC ?
                        <p  >
                            {one_coin.with_calKobithumbBTC}%
                        </p>

                        :
                        <span>
                        </span>
                    }

                </div>
                {one_coin.binanceBTCSym ? <img className="exchange-img" src={binanceimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-two">
                    {one_coin.binanceBTCSym ?
                        <p className="coin-price">
                            {one_coin.binanceBTCSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.binanceBTCSym ?
                        <p className="coin-price">
                            {one_coin.binanceBTCPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.binanceBTCSym ?
                        <p className="coin-price">
                            K-{one_coin.calKobinanceBTC}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.binanceBTCSym ?
                        <p >
                            {one_coin.with_calKobinanceBTC}%
                        </p>

                        :
                        <span>
                        </span>
                    }
                </div>


                {one_coin.gateioBTCSym ? <img className="exchange-img" src={gateioimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-two">
                    {one_coin.gateioBTCSym ?
                        <p className="coin-price">
                            {one_coin.gateioBTCSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.gateioBTCSym ?
                        <p className="coin-price">
                            {one_coin.gateioBTCPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.gateioBTCSym ?
                        <p className="coin-price">
                            K-{one_coin.calKogateioBTC}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.gateioBTCSym ?
                        <p >
                            {one_coin.with_calKogateioBTC}%
                        </p>

                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.huobiBTCSym ? <img className="exchange-img" src={huobiimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-two">
                    {one_coin.huobiBTCSym ?
                        <p className="coin-price">
                            {one_coin.huobiBTCSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.huobiBTCSym ?
                        <p className="coin-price">
                            {one_coin.huobiBTCPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.huobiBTCSym ?
                        <p className="coin-price">
                            K-{one_coin.calKohuobiBTC}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.huobiBTCSym ?
                        <p >
                            {one_coin.with_calKohuobiBTC}%
                        </p>

                        :
                        <span>
                        </span>
                    }
                </div>



                {one_coin.kucoinBTCSym ? <img className="exchange-img" src={kucoinimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-two">
                    {one_coin.kucoinBTCSym ?
                        <p className="coin-price">
                            {one_coin.kucoinBTCSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.kucoinBTCSym ?
                        <p className="coin-price">
                            {one_coin.kucoinBTCPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.kucoinBTCSym ?
                        <p className="coin-price">
                            K-{one_coin.calKokucoinBTC}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.kucoinBTCSym ?
                        <p >
                            {one_coin.with_calKokucoinBTC}%
                        </p>

                        :
                        <span>
                        </span>
                    }
                </div>


                {one_coin.upbitUSDTSym ? <img className="exchange-img" src={upbitimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-three">
                    {one_coin.upbitUSDTSym ?
                        <p className="coin-price">
                            {one_coin.upbitUSDTSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.upbitUSDTSym ?
                        <p className="coin-price">
                            {one_coin.upbitUSDTPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.upbitUSDTSym ?
                        <p className="coin-price">
                            K-{one_coin.calKoupbitUSDT}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.upbitUSDTSym ?
                        <p  >
                            {one_coin.with_calKoupbitUSDT}%
                        </p>

                        :
                        <span>
                        </span>
                    }
                </div>
                {one_coin.binanceUSDTSym ? <img className="exchange-img" src={binanceimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-three">
                    {one_coin.binanceUSDTSym ?
                        <p className="coin-price">
                            {one_coin.binanceUSDTSym}
                        </p>

                        :
                        <span>
                        </span>
                    }
                    {one_coin.binanceUSDTSym ?
                        <p className="coin-price">
                            {one_coin.binanceUSDTPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.binanceUSDTSym ?
                        <p className="coin-price">
                            K-{one_coin.calKobinanceUSDT}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.binanceUSDTSym ?
                        <p  >
                            {one_coin.with_calKobinanceUSDT}%
                        </p>

                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.gateioUSDTSym ? <img className="exchange-img" src={gateioimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-two">
                    {one_coin.gateioUSDTSym ?
                        <p className="coin-price">
                            {one_coin.gateioUSDTSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.gateioUSDTSym ?
                        <p className="coin-price">
                            {one_coin.gateioUSDTPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.gateioUSDTSym ?
                        <p className="coin-price">
                            K-{one_coin.calKogateioUSDT}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.gateioUSDTSym ?
                        <p >
                            {one_coin.with_calKogateioUSDT}%
                        </p>

                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.huobiUSDTSym ? <img className="exchange-img" src={huobiimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-two">
                    {one_coin.huobiUSDTSym ?
                        <p className="coin-price">
                            {one_coin.huobiUSDTSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.huobiUSDTSym ?
                        <p className="coin-price">
                            {one_coin.huobiUSDTPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.huobiUSDTSym ?
                        <p className="coin-price">
                            K-{one_coin.calKohuobiUSDT}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.huobiUSDTSym ?
                        <p >
                            {one_coin.with_calKohuobiUSDT}%
                        </p>

                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.kucoinUSDTSym ? <img className="exchange-img" src={kucoinimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-two">
                    {one_coin.kucoinUSDTSym ?
                        <p className="coin-price">
                            {one_coin.kucoinUSDTSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.kucoinUSDTSym ?
                        <p className="coin-price">
                            {one_coin.kucoinUSDTPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.kucoinUSDTSym ?
                        <p className="coin-price">
                            K-{one_coin.calKokucoinUSDT}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.kucoinUSDTSym ?
                        <p >
                            {one_coin.with_calKokucoinUSDT}%
                        </p>

                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.binanceBUSDSym ? <img className="exchange-img" src={binanceimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-one">
                    {one_coin.binanceBUSDSym ?
                        <p className="coin-price">
                            {one_coin.binanceBUSDSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.binanceBUSDSym ?
                        <p className="coin-price">
                            {one_coin.binanceBUSDPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.binanceBUSDSym ?
                        <p className="coin-price">
                            K-{one_coin.calKobinanceBUSD}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.binanceBUSDSym ?
                        <p >
                            {one_coin.with_calKobinanceBUSD}%
                        </p>

                        :
                        <span>
                        </span>
                    }
                </div>
            </div>
        </div>
    )
}

export default CoinList;
