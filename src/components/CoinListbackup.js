import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CoinMarketData from "../Api/CoinMarketData.json";

import "../components/CoinList.css";
function CoinList({ one_coin, one_coin_Sym }) {
    //const upbitCoinList = Object.keys(coin);
    const upbitimgsrc = CoinMarketData[0].imgsrc;
    const bithumbimgsrc = CoinMarketData[1].imgsrc;
    const binanceimgsrc = CoinMarketData[2].imgsrc;

    var symimg;
    CoinMarketData.find((coinchk) => {
        if (coinchk.symbol === one_coin_Sym) {
            symimg = coinchk.imgsrc;
            return;
        }
    })


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


    var UPBITBTCplus = "";
    if (one_coin.upbitBTC_start_per > 0) {
        UPBITBTCplus = "USDTplus-per";
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
    }

    return (
        <div className='coin-container'>
            <div className="coin-row" >
                <div className='coin'>
                    <img src={symimg} />
                    <h1>{one_coin_Sym}</h1>
                </div>
                <div>{one_coin.testper}</div>
                {one_coin.upbitSym ? <img className="exchange-img" src={upbitimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-one">
                    {one_coin.upbitSym ?
                        <p className="coin-price">
                            {one_coin.upbitSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.upbitSym ?
                        <p className="coin-price">
                            {one_coin.upbitPrice}
                        </p>
                        :
                        <span>
                        </span>
                    }
                </div>
                {one_coin.bithumbSym ? <img className="exchange-img" src={bithumbimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-one">
                    {one_coin.bithumbSym ?
                        <p className="coin-price">
                            {one_coin.bithumbSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.bithumbSym ?
                        <p className="coin-price">
                            {one_coin.bithumbPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.bithumbSym ?
                        <p className={BITHUMBKRWplus}>
                            {one_coin.bithumbKRW_start_per}%
                        </p> :
                        <span>

                        </span>
                    }
                </div>
                {one_coin.upbitBTC ? <img className="exchange-img" src={upbitimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-two">
                    {one_coin.upbitBTC ?
                        <p className="coin-price">
                            {one_coin.upbitBTC}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.upbitBTC ?
                        <p className="coin-price">
                            {one_coin.upbitBTCPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.upbitBTC ?
                        <p className="coin-price">
                            K-{one_coin.calKoupbitBTC}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.upbitBTC ?
                        <p className={UPBITBTCplus}>
                            {one_coin.upbitBTC_start_per}%
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

                </div>
                {one_coin.binanBTCSym ? <img className="exchange-img" src={binanceimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-two">
                    {one_coin.binanBTCSym ?
                        <p className="coin-price">
                            {one_coin.binanBTCSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.binanBTCSym ?
                        <p className="coin-price">
                            {one_coin.binanBTCPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.binanBTCSym ?
                        <p className="coin-price">
                            K-{one_coin.calKobinanBTC}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.binanBTCSym ?
                        <p className={BTCplus} >
                            {one_coin.binBTC_start_per}%
                        </p>

                        :
                        <span>
                        </span>
                    }
                </div>
                {one_coin.upbitUSDT ? <img className="exchange-img" src={upbitimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-three">
                    {one_coin.upbitUSDT ?
                        <p className="coin-price">
                            {one_coin.upbitUSDT}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.upbitUSDT ?
                        <p className="coin-price">
                            {one_coin.upbitUSDTPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.upbitUSDT ?
                        <p className="coin-price">
                            K-{one_coin.calKoupbitUSDT}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.upbitUSDT ?
                        <p className={USDTplus} >
                            {one_coin.upbitUSDT_start_per}%
                        </p>

                        :
                        <span>
                        </span>
                    }
                </div>


                {one_coin.binanUSDTSym ? <img className="exchange-img" src={binanceimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-three">
                    {one_coin.binanUSDTSym ?
                        <p className="coin-price">
                            {one_coin.binanUSDTSym}
                        </p>

                        :
                        <span>
                        </span>
                    }
                    {one_coin.binanUSDTSym ?
                        <p className="coin-price">
                            {one_coin.binanUSDTPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.binanUSDTSym ?
                        <p className="coin-price">
                            K-{one_coin.calKoUSDT}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.binanUSDTSym ?
                        <p className={BINplus} >
                            {one_coin.binUSDT_start_per}%
                        </p>

                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.binanBNBSym ? <img className="exchange-img" src={binanceimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data coin-pair-one">
                    {one_coin.binanBNBSym ?
                        <p className="coin-price">
                            {one_coin.binanBNBSym}
                        </p> :
                        <span>
                        </span>
                    }
                    {one_coin.binanBNBSym ?
                        <p className="coin-price">
                            {one_coin.binanBNBPrice}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.binanBNBSym ?
                        <p className="coin-price">
                            K-{one_coin.calKoBUSD}
                        </p> :
                        <span>

                        </span>
                    }
                    {one_coin.binanBNBSym ?
                        <p className={BINplus} >
                            {one_coin.binBUSD_start_per}%
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
