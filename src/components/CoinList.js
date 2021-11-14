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

    var allCoincal = [
        "with_calKoupbitKRW", "with_calKobithumbKRW", "with_calKocoinoneKRW",
        "with_calKoupbitBTC", "with_calKobithumbBTC", 'with_calKobinanceBTC',
        "with_calKogateioBTC", "with_calKohuobiBTC", "with_calKokucoinBTC",
        "with_calKoupbitUSDT", "with_calKobinanceUSDT", "with_calKogateioUSDT",
        "with_calKohuobiUSDT", "with_calKokucoinUSDT", "with_calKobinanceBUSD"
    ];
    var perPlus = Array.from({ length: allCoincal.length })
    var doubleperPlus = Array.from({ length: allCoincal.length }, () => 0)
    var cnt = 0;
    allCoincal.forEach((data) => {

        if (String(one_coin[data]).indexOf('MIN') !== -1 || String(one_coin[data]).indexOf('MAX') !== -1) {
            doubleperPlus[cnt] = one_coin[data].slice(3, one_coin[data].length);

            if (doubleperPlus[cnt] === " ") {
                doubleperPlus[cnt] = 'none';
            } else if (doubleperPlus[cnt] === "0") {
                doubleperPlus[cnt] = 'none';
            } else if (doubleperPlus[cnt] === 0) {
                doubleperPlus[cnt] = 'none';
            }
        }
        if (doubleperPlus[cnt] === 0 && parseFloat(one_coin[data]) > 0) {
            perPlus[cnt] = 'pluswith_' + data;
        }
        else if (doubleperPlus[cnt] !== '0' && doubleperPlus[cnt] !== "none" && doubleperPlus[cnt] !== 0) {
            perPlus[cnt] = 'goldwith_' + data;
        } else if (doubleperPlus[cnt] === 'none') {
            perPlus[cnt] = "minmaxwith_" + data;
        } else if (doubleperPlus[cnt] === 0) {
            perPlus[cnt] = 'none';
        }
        cnt++;
    })


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
                <div className="coin-data ">
                    {one_coin.upbitKRWSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.upbitKRWSym}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKoupbitKRW}
                            </p>
                            <p className={perPlus[0]}>
                                {one_coin.with_calKoupbitKRW}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>
                {one_coin.bithumbKRWSym ? <img className="exchange-img" src={bithumbimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data ">
                    {one_coin.bithumbKRWSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.bithumbKRWSym}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKobithumbKRW}
                            </p>
                            <p className={perPlus[1]}>
                                {one_coin.with_calKobithumbKRW}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>


                {one_coin.coinoneKRWSym ? <img className="exchange-img" src={coinoneimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data ">
                    {one_coin.coinoneKRWSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.coinoneKRWSym}
                            </p>
                            <p className="coin-price">
                                {one_coin.coinoneKRWPrice}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKocoinoneKRW}
                            </p>
                            <p className={perPlus[2]}>
                                {one_coin.with_calKocoinoneKRW}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.upbitBTCSym ? <img className="exchange-img" src={upbitimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data ">
                    {one_coin.upbitBTCSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.upbitBTCSym}
                            </p>
                            <p className="coin-price">
                                {one_coin.upbitBTCPrice}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKoupbitBTC}
                            </p>
                            <p className={perPlus[3]}>
                                {one_coin.with_calKoupbitBTC}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>
                {one_coin.bithumbBTC ? <img className="exchange-img" src={bithumbimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data ">
                    {one_coin.bithumbBTC ?
                        <>
                            <p className="coin-price">
                                {one_coin.bithumbBTC}
                            </p>
                            <p className="coin-price">
                                {one_coin.bithumbBTCPrice}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKobithumbBTC}
                            </p>
                            <p className={perPlus[4]}>
                                {one_coin.with_calKobithumbBTC}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>
                {one_coin.binanceBTCSym ? <img className="exchange-img" src={binanceimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data ">
                    {one_coin.binanceBTCSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.binanceBTCSym}
                            </p>
                            <p className="coin-price">
                                {one_coin.binanceBTCPrice}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKobinanceBTC}
                            </p>
                            <p className={perPlus[5]}>
                                {one_coin.with_calKobinanceBTC}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>


                {one_coin.gateioBTCSym ? <img className="exchange-img" src={gateioimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data ">
                    {one_coin.gateioBTCSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.gateioBTCSym}
                            </p>
                            <p className="coin-price">
                                {one_coin.gateioBTCPrice}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKogateioBTC}
                            </p>
                            <p className={perPlus[6]}>
                                {one_coin.with_calKogateioBTC}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.huobiBTCSym ? <img className="exchange-img" src={huobiimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data ">
                    {one_coin.huobiBTCSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.huobiBTCSym}
                            </p>
                            <p className="coin-price">
                                {one_coin.huobiBTCPrice}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKohuobiBTC}
                            </p>
                            <p className={perPlus[7]}>
                                {one_coin.with_calKohuobiBTC}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.kucoinBTCSym ? <img className="exchange-img" src={kucoinimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data">
                    {one_coin.kucoinBTCSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.kucoinBTCSym}
                            </p>
                            <p className="coin-price">
                                {one_coin.kucoinBTCPrice}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKokucoinBTC}
                            </p>
                            <p className={perPlus[8]}>
                                {one_coin.with_calKokucoinBTC}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.upbitUSDTSym ? <img className="exchange-img" src={upbitimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data ">

                    {one_coin.upbitUSDTSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.upbitUSDTSym}
                            </p>
                            <p className="coin-price">
                                {one_coin.upbitUSDTPrice}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKoupbitUSDT}
                            </p>
                            <p className={perPlus[9]}>
                                {one_coin.with_calKoupbitUSDT}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>
                {one_coin.binanceUSDTSym ? <img className="exchange-img" src={binanceimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data ">
                    {one_coin.binanceUSDTSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.binanceUSDTSym}
                            </p>
                            <p className="coin-price">
                                {one_coin.binanceUSDTPrice}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKobinanceUSDT}
                            </p>
                            <p className={perPlus[10]}>
                                {one_coin.with_calKobinanceUSDT}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.gateioUSDTSym ? <img className="exchange-img" src={gateioimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data ">

                    {one_coin.gateioUSDTSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.gateioUSDTSym}
                            </p>
                            <p className="coin-price">
                                {one_coin.gateioUSDTPrice}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKogateioUSDT}
                            </p>
                            <p className={perPlus[11]}>
                                {one_coin.with_calKogateioUSDT}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.huobiUSDTSym ? <img className="exchange-img" src={huobiimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data ">
                    {one_coin.huobiUSDTSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.huobiUSDTSym}
                            </p>
                            <p className="coin-price">
                                {one_coin.huobiUSDTPrice}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKohuobiUSDT}
                            </p>
                            <p className={perPlus[12]}>
                                {one_coin.with_calKohuobiUSDT}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.kucoinUSDTSym ? <img className="exchange-img" src={kucoinimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data ">
                    {one_coin.kucoinUSDTSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.kucoinUSDTSym}
                            </p>
                            <p className="coin-price">
                                {one_coin.kucoinUSDTPrice}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKokucoinUSDT}
                            </p>
                            <p className={perPlus[13]}>
                                {one_coin.with_calKokucoinUSDT}%
                            </p>
                        </>
                        :
                        <span>
                        </span>
                    }
                </div>

                {one_coin.binanceBUSDSym ? <img className="exchange-img" src={binanceimgsrc} /> :
                    <div></div>
                }
                <div className="coin-data ">
                    {one_coin.binanceBUSDSym ?
                        <>
                            <p className="coin-price">
                                {one_coin.binanceBUSDSym}
                            </p>
                            <p className="coin-price">
                                {one_coin.binanceBUSDPrice}
                            </p>
                            <p className="coin-price">
                                K-{one_coin.calKobinanceBUSD}
                            </p>
                            <p className={perPlus[14]}>
                                {one_coin.with_calKobinanceBUSD}%
                            </p>
                        </>
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
