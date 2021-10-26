import { takeEvery, call, put, select, flush, delay } from "redux-saga/effects";
import axios from "axios";
import CoinMarketData from "../Api/CoinMarketData.json";
import { conforms } from "lodash";

const coinListDataUtils = {
    marketNames: (names) => {
        const data = {};
        names.forEach(name => {
            let shortSym = name.market.split("-")[1];
            let moneySym = name.market.split("-")[0];
            if (moneySym === "KRW") {
                data[shortSym] = {
                    ...data[shortSym],
                    upbitSym: name.market
                }
            } else if (moneySym === "USDT") {
                data[shortSym] = {
                    ...data[shortSym],
                    upbitUSDT: name.market
                }
            } else if (moneySym === "BTC") {
                data[shortSym] = {
                    ...data[shortSym],
                    upbitBTC: name.market
                }
            }
        });
        return data;
    },
    upbitAllNames: (names) => {
        const data = {};
        //console.log(names);
        names.forEach(name => {
            data[name.market] = {
                korean: name.korean_name,
                english: name.english_name,
            };
        })
        return data;
    },
    upbitPriceNames: (names, state) => {
        const coinStateDatas = state.Coin.upbitTotalNames.data;

        names.forEach(name => {
            //console.log("name", name);
            let nowPrice = parseFloat(name.trade_price);
            if (nowPrice < 1.0) {
                nowPrice = nowPrice.toFixed(8);
            }
            else {
                nowPrice = nowPrice.toFixed(1);
            }
            coinStateDatas[name.market] = {
                korean: nowPrice,
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
        //console.log(data);
        return data;
    },
    bithumbKRWNames: (names) => {
        const data = {};
        Object.keys(names).forEach(name => {
            let nowPrice = parseFloat(names[name].closing_price);
            if (nowPrice < 1.0) {
                nowPrice = nowPrice.toFixed(8);
            }
            else {
                nowPrice = nowPrice.toFixed(1);
            }
            data[name + "_KRW"] = {
                korean: nowPrice,
            };
        })

        return data;
    },
    bithumbBTCNames: (names, state) => {
        const coinStateDatas = state.Coin.bithumbTotalNames.data;

        Object.keys(names).forEach(name => {
            let nowPrice = parseFloat(names[name].closing_price);
            if (nowPrice < 1.0) {
                nowPrice = nowPrice.toFixed(8);
            }
            else {
                nowPrice = nowPrice.toFixed(1);
            }
            coinStateDatas[name + "_BTC"] = {
                korean: nowPrice,
            };
        })
        return coinStateDatas;
    }
};

const coinReadDataUtils = {
    upbitUpdates: (names, state) => {
        const coinStateDatas = state.Coin.marketNames.data;
        //console.log("name", names);
        names.forEach(name => {

            let shortSym = name.code.split("-")[1];
            let moneySym = name.code.split("-")[0];
            let nowPrice = parseFloat(name.trade_price);

            if (nowPrice < 1.0) {
                nowPrice = nowPrice.toFixed(8);
            }
            else {
                nowPrice = nowPrice.toFixed(1);
            }
            if (moneySym === "KRW") {
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    upbitPrice: nowPrice
                }
                //return coinStateDatas;
            } else if (moneySym === "USDT") {
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    upbitUSDTPrice: nowPrice
                }
                //return coinStateDatas;
            } else if (moneySym === "BTC") {
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    upbitBTCPrice: nowPrice
                }
            }
        });
        return coinStateDatas;
    },
    getUpbitAllMarketNameSagabithumbUpdates: (names, state) => {
        const coinStateDatas = state.Coin.marketNames.data;

        names.forEach(name => {

            let shortSym = name.symbol.split("_")[0];
            let moneySym = name.symbol.split("_")[1];
            let nowPrice = name.closePrice;

            if (typeof (nowPrice) === 'string')
                nowPrice = parseFloat(nowPrice);

            if (nowPrice < 1.0) {
                nowPrice = nowPrice.toFixed(8);
            } else {
                nowPrice = nowPrice.toFixed(1);
            }

            if (moneySym === "KRW") {
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    bithumbPrice: nowPrice
                }
            }
            else if (moneySym === "BTC") {
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    bithumbBTCPrice: nowPrice
                }
            }
        });
        return coinStateDatas;
    },
    //✅
    mixExchangeUpdates: (one_names, two_names, three_names, gecko_data, state) => {
        const coinStateDatas = state.Coin.marketNames.data;
        //✅ gecko
        /* Object.keys(gecko_data).map(name => {
             let shortSym = CoinMarketData.find((coinsym) => {
                 if (coinsym.totalName === name)
                     return coinsym;
             })
 
             coinStateDatas[shortSym.symbol] = {
                 ...coinStateDatas[shortSym.symbol],
                 gecko: gecko_data[name].usd
             }
         });*/

        //✅ bithumb
        two_names.forEach(name => {
            let shortSym = name.symbol.split("_")[0];
            let moneySym = name.symbol.split("_")[1];
            let nowPrice = name.closePrice;
            if (typeof (nowPrice) === 'string')
                nowPrice = parseFloat(nowPrice);

            if (nowPrice < 1.0) {
                nowPrice = nowPrice.toFixed(8);
            }
            else {
                nowPrice = nowPrice.toFixed(1);
            }

            if (moneySym === "KRW") {
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    bithumbPrice: nowPrice
                }
            }
            else if (moneySym === "BTC") {
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    bithumbBTCPrice: nowPrice
                }
            }
        });
        //✅ upbit
        one_names.forEach(name => {
            let shortSym = name.code.split("-")[1];
            let moneySym = name.code.split("-")[0];
            let nowPrice = name.trade_price;
            var sortOrder = [];
            if (typeof (nowPrice) === 'string')
                nowPrice = parseFloat(nowPrice);

            if (nowPrice < 1.0) {
                nowPrice = nowPrice.toFixed(8);
            }
            else {
                nowPrice = nowPrice.toFixed(1);
            }


            if (moneySym === "KRW") {
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    upbitPrice: nowPrice
                }
            } else if (moneySym === "USDT") {
                var cal = (parseFloat(coinStateDatas['USDT'].upbitUSDTPrice) * parseFloat(nowPrice)).toFixed(1)

                if (coinStateDatas[shortSym]) {
                    Object.keys(coinStateDatas[shortSym]).filter((list) => {
                        if (list === 'upbitSym') {
                            sortOrder[0] = 'upbitSym';
                            return sortOrder;
                        } else if (list === 'upbitUSDT') {
                            sortOrder[1] = 'upbitUSDT';
                            return sortOrder;
                        }
                        else if (list === 'upbitBTC') {
                            sortOrder[2] = 'upbitBTC';
                            return sortOrder;
                        }
                    })
                    if (!sortOrder[0]) {
                        sortOrder.splice(0, 1);
                    }
                    else if (!sortOrder[1]) {
                        sortOrder.splice(1, 1);
                    }
                }

                if (sortOrder[0] === 'upbitSym') {
                    var calper = ((cal - parseFloat(coinStateDatas[shortSym].upbitPrice)) / cal * 100).toFixed(2)
                } else if (sortOrder[0] === 'upbitUSDT') {
                    var calper = ((cal - parseFloat(coinStateDatas[shortSym].calKoupbitBTC)) / cal * 100).toFixed(2)
                } else if (sortOrder[1] === 'upbitBTC') {
                    var calper = ((cal - parseFloat(coinStateDatas[shortSym].calKoupbitBTC)) / cal * 100).toFixed(2)
                } else {
                    var calper = "None";
                }

                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    upbitUSDTPrice: nowPrice,

                    upbitUSDT_start_per: calper,
                    calKoupbitUSDT: cal
                }
            } else if (moneySym === "BTC") {
                var origin = parseFloat(coinStateDatas['BTC'].upbitPrice);
                var cal = (origin * parseFloat(nowPrice)).toFixed(2)
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    upbitBTCPrice: nowPrice,

                    calKoupbitBTC: cal
                }
            }

            if (coinStateDatas['BTC'].upbitPrice) {
                //@
                var upbitusdtkrw = (coinStateDatas['BTC'].upbitPrice / coinStateDatas['BTC'].upbitUSDTPrice).toFixed(1);

                coinStateDatas['USDT'] = {
                    ...coinStateDatas['USDT'],

                    upbitUSDT: 'USDTKRW',
                    upbitUSDTPrice: upbitusdtkrw
                }
            }
        });


        //✅ binance
        three_names.forEach(name => {
            let nowPrice = name.price;

            if (name.symbol === 'DENTBTC' || name.symbol === 'MFTBTC' || name.symbol === 'SUNBTC' || name.symbol === 'BTTBTC') {
                return coinStateDatas;
            }

            if (typeof (nowPrice) === 'string')
                nowPrice = parseFloat(nowPrice);

            if (nowPrice < 1.0) {
                nowPrice = nowPrice.toFixed(8);
            }
            else {
                nowPrice = nowPrice.toFixed(1);
            }

            var sortOrder = [];


            if (name.symbol.lastIndexOf('BTC') !== -1) {
                var len = name.symbol.indexOf('BTC');
                var coin = name.symbol.slice(0, len);
                var cal = (parseFloat(coinStateDatas['BTC'].upbitPrice) * parseFloat(nowPrice)).toFixed(1)

                if (coinStateDatas[coin]) {
                    Object.keys(coinStateDatas[coin]).filter((list) => {
                        if (list === 'upbitSym') {
                            sortOrder[0] = 'upbitSym';
                            return sortOrder;
                        } else if (list === 'upbitUSDT') {
                            sortOrder[1] = 'upbitUSDT';
                            return sortOrder;
                        }
                        else if (list === 'upbitBTC') {
                            sortOrder[2] = 'upbitBTC';
                            return sortOrder;
                        }
                    })
                    if (!sortOrder[0] && !sortOrder[1]) {
                        sortOrder.splice(0, 2);
                    }
                    else if (!sortOrder[0]) {
                        sortOrder.splice(0, 1);
                    }
                    else if (!sortOrder[1]) {
                        sortOrder.splice(1, 1);
                    }
                }/*
                if (coin === 'DGB') {
                    //!
                    console.log(sortOrder);
                }*/
                var calper;
                if (sortOrder[0] === 'upbitBTC') {
                    calper = ((cal - parseFloat(coinStateDatas[coin].calKoupbitBTC)) / cal * 100).toFixed(2)
                }
                else if (sortOrder[0] === "upbitUSDT") {
                    calper = "prepare";
                    //alper = ((cal - parseFloat(coinStateDatas[coin].calKoupbitBTC)) / cal * 100).toFixed(2)
                } else if (sortOrder[0] === 'upbitSym') {
                    calper = ((cal - parseFloat(coinStateDatas[coin].upbitPrice)) / cal * 100).toFixed(2)
                }

                if (coin !== "") {
                    coinStateDatas[coin] = {
                        ...coinStateDatas[coin],
                        binanBTCSym: name.symbol,
                        binanBTCPrice: nowPrice,
                        calKobinanBTC: cal,
                        binBTC_start_per: calper
                    }
                }
            } else if (name.symbol.lastIndexOf('USDT') !== -1) {
                var len = name.symbol.indexOf('USDT');

                var coin = name.symbol.slice(0, len);
                var cal = (parseFloat(coinStateDatas['USDT'].upbitUSDTPrice) * parseFloat(nowPrice)).toFixed(1);



                var calper;
                if (coinStateDatas[coin]) {
                    Object.keys(coinStateDatas[coin]).filter((list) => {
                        if (list === 'upbitSym') {
                            sortOrder[0] = 'upbitSym';
                            return sortOrder;
                        } else if (list === 'upbitUSDT') {
                            sortOrder[1] = 'upbitUSDT';
                            return sortOrder;
                        }
                        else if (list === 'upbitBTC') {
                            sortOrder[2] = 'upbitBTC';
                            return sortOrder;
                        }
                    })
                    if (!sortOrder[0] && !sortOrder[1]) {
                        sortOrder.splice(0, 2);
                    }
                    else if (!sortOrder[0]) {
                        sortOrder.splice(0, 1);
                    }
                    else if (!sortOrder[1]) {
                        sortOrder.splice(1, 1);
                    }
                }

                if (sortOrder[0] === 'upbitBTC') {

                    calper = ((cal - parseFloat(coinStateDatas[coin].calKoupbitBTC)) / cal * 100).toFixed(2)
                }
                else if (sortOrder[0] === "upbitUSDT") {
                    calper = ((cal - parseFloat(coinStateDatas[coin].calKoupbitUSDT)) / cal * 100).toFixed(2)
                } else if (sortOrder[0] === 'upbitSym') {
                    calper = ((cal - parseFloat(coinStateDatas[coin].upbitPrice)) / cal * 100).toFixed(2)
                }
                /*
                                if (coin === 'DGB') {
                                    console.log(coin, cal, calper, sortOrder);
                                }*/

                if (coin !== "") {
                    coinStateDatas[coin] = {
                        ...coinStateDatas[coin],
                        binanUSDTSym: name.symbol,
                        binanUSDTPrice: nowPrice,
                        calKoUSDT: cal,//(parseFloat(coinStateDatas['USDT'].upbitUSDTPrice) * parseFloat(nowPrice)).toFixed(1)
                        binUSDT_start_per: calper,
                    }
                }
            } else if (name.symbol.lastIndexOf('BUSD') !== -1) {
                var len = name.symbol.indexOf('BUSD');
                var coin = name.symbol.slice(0, len);
                if (coin !== "") {
                    coinStateDatas[coin] = {
                        ...coinStateDatas[coin],
                        binanBNBSym: name.symbol,
                        binanBNBPrice: nowPrice,
                        //calKoUSDT: (parseFloat(coinStateDatas['USDT'].upbitUSDTPrice) * parseFloat(nowPrice)).toFixed(1)
                    }
                }
            }

            if (name.symbol === 'BTCBUSD') {

                coinStateDatas['BTC'] = {
                    ...coinStateDatas['BTC'],
                    binanBNBSym: name.symbol,
                    binanBNBPrice: nowPrice

                }
            } else if (name.symbol === 'BTCUSDT') {
                var cal = (parseFloat(coinStateDatas['USDT'].upbitUSDTPrice) * parseFloat(nowPrice)).toFixed(1)
                coinStateDatas['BTC'] = {
                    ...coinStateDatas['BTC'],
                    binanUSDTSym: name.symbol,
                    binanUSDTPrice: nowPrice,
                    calKoUSDT: cal,
                    per: ((cal - parseFloat(coinStateDatas['BTC'].upbitPrice)) / cal * 100).toFixed(2)
                }
            }
        });

        return coinStateDatas;
    },
    //
    upbitInitNames: (names, state) => {
        const data = {};
        Object.keys(names).forEach(name => {
            let shortSym = name.split("-")[1];
            let moneySym = name.split("-")[0];

            if (shortSym === "BTC" && moneySym === "KRW") {
                data[shortSym] = {
                    ...data[shortSym],
                    upbitPrice: names[name].korean,
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

        var upbitusdtkrw = (data['BTC'].upbitPrice / data['BTC'].upbitUSDTPrice).toFixed(1);

        data['USDT'] = {
            ...data['USDT'],
            upbitUSDTPrice: upbitusdtkrw,
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
                    upbitPrice: names[name].korean,
                    upbitSym: name,
                    imgsrc: imgsrc
                }
            } else if (moneySym === "USDT") {


                data[shortSym] = {
                    ...data[shortSym],
                    upbitUSDTPrice: names[name].korean,
                    upbitUSDT: name,
                    imgsrc: imgsrc,
                    calKoupbitUSDT: (parseFloat(data['USDT'].upbitUSDTPrice) * parseFloat(names[name].korean)).toFixed(1)
                }
            } else if (moneySym === "BTC") {


                data[shortSym] = {
                    ...data[shortSym],
                    upbitBTCPrice: names[name].korean,
                    upbitBTC: name,
                    imgsrc: imgsrc,
                    calKoupbitBTC: (parseFloat(data['BTC'].upbitPrice) * parseFloat(names[name].korean)).toFixed(2)
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
                }
            }
        })


        return coinStateDatas;
    }
};


export {
    coinListDataUtils,
    coinReadDataUtils
}