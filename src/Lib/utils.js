
import axios from "axios";
import { Children } from "react";
import CoinMarketData from "../Api/CoinMarketData.json";

const pricereturnFloat = (price) => {
    let data = parseFloat(price);
    if (data < 1.0) {
        return data.toFixed(8);
    }
    else {
        return data.toFixed(1);
    }
}

const coinListDataUtils = {
    coinoneAllNames: (names) => {

    },

    kucoinAllNames: (names) => {
        names.forEach(coinlist => {
            var coinName = coinlist.symbol.split('-')[0];
            var type = coinlist.symbol.split('-')[1];

            var newCoin = false;
            if (type !== 'ETH') {
                CoinMarketData.find((name) => {
                    if (name.symbol === coinName) {
                        newCoin = true;
                    }
                });
                if (newCoin === false) {
                    console.log(coinName, type);
                }
            }
        });
    },

    upbitAllNames: (names) => {
        const data = {};
        names.forEach(name => {
            data[name.market] = {
                korean: name.korean_name,
            };
        })
        return data;
    },
    upbitPriceNames: (names, state) => {
        const coinStateDatas = state.Coin.upbitTotalNames.data;
        names.forEach(name => {
            coinStateDatas[name.market] = {
                korean: pricereturnFloat(name.trade_price),
            };
        })
        return coinStateDatas;
    },

    binanceNames: (names) => {
        const data = {};
        names.forEach(name => {
            if (name.symbol.lastIndexOf('BTC') !== -1) {
                data[name.symbol] = {
                    korean: name.price
                };
            } else if (name.symbol.lastIndexOf('USDT') !== -1) {
                data[name.symbol] = {
                    korean: name.price
                };
            } else if (name.symbol.lastIndexOf('BUSD') !== -1) {
                data[name.symbol] = {
                    korean: name.price
                };
            }
        })
        return data;
    },
    bithumbKRWNames: (names) => {
        const data = {};
        Object.keys(names).forEach(name => {
            data[name + "_KRW"] = {
                korean: pricereturnFloat(names[name].closing_price),
            };
        })
        return data;
    },
    bithumbBTCNames: (names, state) => {
        const coinStateDatas = state.Coin.bithumbTotalNames.data;
        Object.keys(names).forEach(name => {
            coinStateDatas[name + "_BTC"] = {
                korean: pricereturnFloat(names[name].closing_price),
            };
        })
        return coinStateDatas;
    }
};

const coinReadDataUtils = {
    mixExchangeUpdates: (all_coin, state) => {
        const coinStateDatas = state.Coin.marketNames.data;
        const TOPmarketNames = state.Coin.TOPmarketNames;
        const TOPmarketString = state.Coin.TOPmarketString;
        var priceithdraw = [], minExchange = '', maxExchange = '';
        Object.keys(all_coin).forEach((coin) => {
            coinStateDatas[coin] = {
                ...coinStateDatas[coin],
                ...all_coin[coin]
            }
        });
        var cal = (parseFloat(coinStateDatas['BTC'].upbitKRWPrice) / parseFloat(coinStateDatas['BTC'].upbitUSDTPrice)).toFixed(1)
        coinStateDatas['USDTKRW'] = {
            ...coinStateDatas['USDTKRW'],
            "USDTsym": "USDT-KRW",
            "USDTKRWPrice": cal
        }



        Object.keys(coinStateDatas).forEach((coin) => {
            var read = coinStateDatas[coin];
            var keyread = Object.keys(read);
            var saveName = '', saveNamee = '';
            var withdraw_cal = '';
            var maxGap = 0, minGap = Number.MAX_SAFE_INTEGER;
            cal = 0;
            keyread.forEach((name) => {
                if (name === 'bithumbKRWSym') {
                    cal = parseFloat(coinStateDatas[coin].bithumbKRWPrice);// * parseFloat(coinStateDatas[coin].upbitUSDTPrice)).toFixed(1)
                    saveName = 'calKobithumbKRW';

                    var withdrawCheck = coinStateDatas[coin].bithumbWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);

                    withdraw_cal = withdrawCheck * parseFloat(cal);
                    priceithdraw['calKobithumbKRW'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }
                else if (name === 'upbitKRWSym') {
                    cal = parseFloat(coinStateDatas[coin].upbitKRWPrice)// * parseFloat(coinStateDatas[coin].upbitUSDTPrice)).toFixed(1)
                    saveName = 'calKoupbitKRW';

                    var withdrawCheck = coinStateDatas[coin].upbitWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);

                    withdraw_cal = withdrawCheck * parseFloat(cal);
                    priceithdraw['calKoupbitKRW'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }

                else if (name === 'coinoneKRWSym') {
                    cal = parseFloat(coinStateDatas[coin].coinoneKRWPrice)// * parseFloat(coinStateDatas[coin].upbitUSDTPrice)).toFixed(1)
                    saveName = 'calKocoinoneKRW';

                    var withdrawCheck = coinStateDatas[coin].coinoneWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);


                    withdraw_cal = withdrawCheck * parseFloat(cal);
                    priceithdraw['calKocoinoneKRW'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }

                else if (name === 'upbitUSDTSym') {
                    cal = (parseFloat(coinStateDatas['USDTKRW'].USDTKRWPrice) * parseFloat(coinStateDatas[coin].upbitUSDTPrice)).toFixed(1)
                    saveName = 'calKoupbitUSDT';

                    var withdrawCheck = coinStateDatas[coin].upbitWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);

                    withdraw_cal = withdrawCheck * parseFloat(cal);
                    priceithdraw['calKoupbitUSDT'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }
                // upbit BTC
                else if (name === 'upbitBTCSym') {
                    cal = (parseFloat(coinStateDatas['BTC'].upbitKRWPrice) * parseFloat(coinStateDatas[coin].upbitBTCPrice)).toFixed(1)
                    saveName = 'calKoupbitBTC';

                    var withdrawCheck = coinStateDatas[coin].upbitWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);

                    withdraw_cal = parseFloat(coinStateDatas[coin].withdrawCheck) * parseFloat(cal);
                    priceithdraw['calKoupbitBTC'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }
                // binance USDT
                else if (name === 'binanceUSDTSym') {
                    cal = (parseFloat(coinStateDatas['USDTKRW'].USDTKRWPrice) * parseFloat(coinStateDatas[coin].binanceUSDTPrice)).toFixed(1)
                    saveName = 'calKobinanceUSDT';

                    var withdrawCheck = coinStateDatas[coin].binanceWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);

                    withdraw_cal = withdrawCheck * parseFloat(cal);
                    priceithdraw['calKobinanceUSDT'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }
                // binance BTC
                else if (name === 'binanceBTCSym') {
                    //if (coin === 'XRP')
                    //    console.log(coinStateDatas['BTC'].upbitKRWPrice, coinStateDatas[coin].binanceBTCPrice);
                    cal = (parseFloat(coinStateDatas['BTC'].upbitKRWPrice) * parseFloat(coinStateDatas[coin].binanceBTCPrice)).toFixed(1)
                    saveName = 'calKobinanceBTC';

                    var withdrawCheck = coinStateDatas[coin].binanceWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);

                    withdraw_cal = withdrawCheck * parseFloat(cal);
                    priceithdraw['calKobinanceBTC'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }
                // binance BUSD
                else if (name === 'binanceBUSDSym') {
                    cal = (parseFloat(coinStateDatas['USDTKRW'].USDTKRWPrice) * parseFloat(coinStateDatas[coin].binanceBUSDPrice)).toFixed(1)
                    saveName = 'calKobinanceBUSD';

                    var withdrawCheck = coinStateDatas[coin].binanceWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);

                    withdraw_cal = withdrawCheck * parseFloat(cal);
                    priceithdraw['calKobinanceBUSD'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }
                // gateIO BTC
                else if (name === 'gateioBTCSym') {
                    cal = (parseFloat(coinStateDatas['BTC'].upbitKRWPrice) * parseFloat(coinStateDatas[coin].gateioBTCPrice)).toFixed(1)
                    saveName = 'calKogateioBTC';


                    var withdrawCheck = coinStateDatas[coin].gateioWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);

                    withdraw_cal = withdrawCheck * parseFloat(cal);
                    priceithdraw['calKogateioBTC'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }
                // gateIO USDT
                else if (name === 'gateioUSDTSym') {
                    cal = (parseFloat(coinStateDatas['USDTKRW'].USDTKRWPrice) * parseFloat(coinStateDatas[coin].gateioUSDTPrice)).toFixed(1)
                    saveName = 'calKogateioUSDT';


                    var withdrawCheck = coinStateDatas[coin].gateioWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);

                    withdraw_cal = withdrawCheck * parseFloat(cal);

                    priceithdraw['calKogateioUSDT'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }
                //huobi BTC
                else if (name === 'huobiBTCSym') {
                    cal = (parseFloat(coinStateDatas['BTC'].upbitKRWPrice) * parseFloat(coinStateDatas[coin].huobiBTCPrice)).toFixed(1)
                    saveName = 'calKohuobiBTC';

                    var withdrawCheck = coinStateDatas[coin].huobiWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);

                    withdraw_cal = withdrawCheck * parseFloat(cal);
                    priceithdraw['calKohuobiBTC'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }
                //huobi USDT
                else if (name === 'huobiUSDTSym') {
                    cal = (parseFloat(coinStateDatas['USDTKRW'].USDTKRWPrice) * parseFloat(coinStateDatas[coin].huobiUSDTPrice)).toFixed(1)
                    saveName = 'calKohuobiUSDT';

                    var withdrawCheck = coinStateDatas[coin].huobiWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);

                    withdraw_cal = withdrawCheck * parseFloat(cal);
                    priceithdraw['calKohuobiUSDT'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }
                //kucoin USDT
                else if (name === 'kucoinUSDTSym') {
                    cal = (parseFloat(coinStateDatas['USDTKRW'].USDTKRWPrice) * parseFloat(coinStateDatas[coin].kucoinUSDTPrice)).toFixed(1)
                    saveName = 'calKokucoinUSDT';

                    var withdrawCheck = coinStateDatas[coin].kucoinWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);

                    withdraw_cal = withdrawCheck * parseFloat(cal);
                    priceithdraw['calKokucoinUSDT'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }
                else if (name === 'kucoinBTCSym') {
                    cal = (parseFloat(coinStateDatas['BTC'].upbitKRWPrice) * parseFloat(coinStateDatas[coin].kucoinBTCPrice)).toFixed(1)
                    saveName = 'calKokucoinBTC';
                    var withdrawCheck = coinStateDatas[coin].kucoinWithdraw;
                    if (withdrawCheck === 'NO')
                        withdrawCheck = 1;
                    else if (withdrawCheck === '0')
                        withdrawCheck = 1;
                    else
                        withdrawCheck = parseFloat(withdrawCheck);

                    withdraw_cal = withdrawCheck * parseFloat(cal);
                    priceithdraw['calKokucoinBTC'] = {
                        'withdrawlCal': withdraw_cal,
                        'Cal': cal
                    }
                }
                if (cal != 0) {
                    if (parseFloat(cal) > maxGap) {
                        maxGap = parseFloat(cal);
                        maxExchange = saveName;
                    }
                    if (parseFloat(cal) < minGap) {
                        minGap = parseFloat(cal);
                        minExchange = saveName;
                    }
                }
                coinStateDatas[coin] = {
                    ...coinStateDatas[coin],
                    [saveName]: cal
                }
            });

            var result = ((maxGap - minGap) / minGap * 100).toFixed(1);



            if (maxExchange) {
                var maxprice = priceithdraw[maxExchange].Cal;

                keyread.forEach((name) => {
                    if (name === 'calKoupbitUSDT' ||
                        name === 'calKoupbitBTC' ||
                        name === 'calKobinanceUSDT' ||
                        name === 'calKobinanceBTC' ||
                        name === 'calKobinanceBUSD' ||
                        name === 'calKogateioBTC' ||
                        name === 'calKogateioUSDT' ||
                        name === 'calKohuobiBTC' ||
                        name === 'calKohuobiUSDT' ||
                        name === 'calKokucoinUSDT' ||
                        name === 'calKokucoinBTC' ||
                        name === 'calKocoinoneKRW' ||
                        name === 'calKoupbitKRW' ||
                        name === 'calKobithumbKRW'
                    ) {
                        var calcc = '';
                        if (name !== maxExchange) {
                            //if (coin === 'EDEN')
                            //    console.log('max', maxprice, priceithdraw[name])
                            if (maxprice > priceithdraw[name].withdrawlCal) {
                                calcc = ((maxprice - priceithdraw[name].withdrawlCal) / priceithdraw[name].withdrawlCal * 100).toFixed(1)
                            }
                            else {
                                calcc = 0;
                            }
                            if (calcc < 0) {
                                calcc = 0;
                            }
                            saveName = 'with_' + name
                        } else {
                            if (calcc != '0')
                                calcc = "MAX " + calcc;
                            else
                                calcc = '0';
                            saveName = 'with_' + name
                        }

                        if (name === minExchange) {
                            calcc = "MIN" + calcc;
                        }

                        coinStateDatas[coin] = {
                            ...coinStateDatas[coin],
                            [saveName]: calcc,
                            'per': result,
                            'MainSym': coin
                        }
                    }
                })
            }
        });
        var coinStateCount = 0;
        var coinStringMake = "";
        var test = "";
        Object.keys(coinStateDatas).forEach((coinOne) => {
            if (coinStateDatas[coinOne].per > 2) {
                TOPmarketNames[coinStateCount] = coinStateDatas[coinOne];//coinStateDatas[coinOne]
                coinStateCount++;

                test += coinOne + " ";
            }
        })
        TOPmarketNames.pop();


        return coinStateDatas;
    },
    //
    upbitInitNames: (names, state) => {

        var stringdd = "";
        CoinMarketData.find((name) => {
            stringdd += name.symbol + " "
        });
        const data = {};
        Object.keys(names).forEach(name => {
            let shortSym = name.split("-")[1];
            let moneySym = name.split("-")[0];

            if (shortSym === "BTC" && moneySym === "KRW") {
                data[shortSym] = {
                    ...data[shortSym],
                    upbitKRWPrice: names[name].korean,
                    upbitSym: name,
                }
            } else if (shortSym === "BTC" && moneySym === "USDT") {
                data[shortSym] = {
                    ...data[shortSym],
                    upbitUSDTPrice: names[name].korean,
                    upbitUSDT: name,
                }
            }
        })
        data['USDT'] = {
            ...data['USDT'],
            upbitUSDTPrice: (data['BTC'].upbitKRWPrice / data['BTC'].upbitUSDTPrice).toFixed(1),
            upbitUSDT: 'USDTKRW',
        }

        Object.keys(names).forEach(name => {

            let shortSym = name.split("-")[1];
            let moneySym = name.split("-")[0];
            let imgsrc = "";
            CoinMarketData.find((coin) => {
                if (coin.symbol === shortSym) {
                    imgsrc = coin.imgsrc;
                }
            })
            if (moneySym === "KRW") {
                data[shortSym] = {
                    ...data[shortSym],
                    upbitKRWPrice: names[name].korean,
                    upbitSym: name,
                    imgsrc: imgsrc
                }
            } else if (moneySym === "USDT") {
                data[shortSym] = {
                    ...data[shortSym],
                    upbitUSDTPrice: names[name].korean,
                    upbitUSDT: name,
                    imgsrc: imgsrc,
                    //calKoupbitUSDT: (parseFloat(data['USDT'].upbitUSDTPrice) * parseFloat(names[name].korean)).toFixed(1)
                }
            } else if (moneySym === "BTC") {
                data[shortSym] = {
                    ...data[shortSym],
                    upbitBTCPrice: names[name].korean,
                    upbitBTC: name,
                    imgsrc: imgsrc,
                    //calKoupbitBTC: (parseFloat(data['BTC'].upbitKRWPrice) * parseFloat(names[name].korean)).toFixed(2)
                }
            }
        });
        return data;
    },
    bithumbInitNames: (names, state) => {
        const coinStateDatas = state.Coin.marketNames.data;

        Object.keys(names).forEach(name => {
            let shortSym = name.split("_")[0];
            let moneySym = name.split("_")[1];

            if (moneySym === "KRW") {
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    bithumbPrice: names[name].korean,
                    bithumbSym: name,
                }
            } else if (moneySym === "BTC") {
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    bithumbBTCPrice: names[name].korean,
                    bithumbBTC: name,
                    calKobithumbBTC: (parseFloat(coinStateDatas['BTC'].upbitKRWPrice) * parseFloat(names[name].korean)).toFixed(2)
                }
            }
        })


        //!


        return coinStateDatas;
    }
};


export {
    coinListDataUtils,
    coinReadDataUtils
}