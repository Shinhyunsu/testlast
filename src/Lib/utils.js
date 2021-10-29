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
    mixExchangeUpdates: (one_names, two_names, three_names, state) => {
        const coinStateDatas = state.Coin.marketNames.data;
        //✅ bithumb
        two_names.forEach(name => {
            let shortSym = name.symbol.split("_")[0];
            let moneySym = name.symbol.split("_")[1];
            let nowPrice = pricereturnFloat(name.closePrice);
            var sortOrder = [];
            var cal, calper;

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

            if (moneySym === "KRW") {

                if (sortOrder[0] === 'upbitSym') {
                    calper = ((nowPrice - parseFloat(coinStateDatas[shortSym].upbitPrice)) / nowPrice * 100).toFixed(2)
                }

                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    bithumbPrice: nowPrice,
                    bithumbKRW_start_per: calper
                }

            }
            else if (moneySym === "BTC") {
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    bithumbBTCPrice: nowPrice,
                    calKobithumbBTC: (parseFloat(coinStateDatas['BTC'].bithumbPrice) * parseFloat(nowPrice)).toFixed(1)
                }
            }
        });
        //✅ upbit
        one_names.forEach(name => {
            let shortSym = name.code.split("-")[1];
            let moneySym = name.code.split("-")[0];
            let nowPrice = pricereturnFloat(name.trade_price);
            var sortOrder = [];
            var cal, calper;

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


            if (moneySym === "KRW") {
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    upbitPrice: nowPrice
                }
            } else if (moneySym === "USDT") {
                cal = (parseFloat(coinStateDatas['USDT'].upbitUSDTPrice) * parseFloat(nowPrice)).toFixed(1)

                if (sortOrder[0] === 'upbitSym') {
                    calper = ((cal - parseFloat(coinStateDatas[shortSym].upbitPrice)) / cal * 100).toFixed(2)
                } else if (sortOrder[0] === 'upbitUSDT') {
                    calper = ((cal - parseFloat(coinStateDatas[shortSym].calKoupbitBTC)) / cal * 100).toFixed(2)
                } else if (sortOrder[1] === 'upbitBTC') {
                    calper = ((cal - parseFloat(coinStateDatas[shortSym].calKoupbitBTC)) / cal * 100).toFixed(2)
                } else {
                    calper = "Prepare";
                }

                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    upbitUSDTPrice: nowPrice,

                    upbitUSDT_start_per: calper,
                    calKoupbitUSDT: cal
                }
            } else if (moneySym === "BTC") {
                var origin = parseFloat(coinStateDatas['BTC'].upbitPrice);
                cal = (origin * parseFloat(nowPrice)).toFixed(2);

                if (sortOrder[0] === 'upbitBTC') {
                    calper = 'prepare';

                } else if (sortOrder[0] === 'upbitSym') {
                    calper = ((cal - parseFloat(coinStateDatas[shortSym].upbitPrice)) / cal * 100).toFixed(2);
                }

                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    upbitBTCPrice: nowPrice,
                    //!
                    calKoupbitBTC: cal,
                    upbitBTC_start_per: calper
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
            let nowPrice = pricereturnFloat(name.price);
            var sortOrder = [];
            var len, cal, calper, coin;
            let moneySym;
            let exceptionArr = ['VENUSDT', 'VENBTC', , 'MBLBTC',
                'TUSDBTC', 'DAIBTC', 'REPBUSD', 'STORJBUSD', 'DENTBTC', 'MFTBTC',
                'SUNBTC', 'BTTBTC', 'COCOSBTC', 'PAXBTC', 'PAXUSDT', 'PAXBUSD',
                'BCHSVBTC', 'BCHSVUSDT', 'BCCBTC', 'BCCUSDT', 'HOTBTC', 'BCHABCBTC',
                'BCHABCUSDT', 'BCHABCBUSD', 'STORMBTC', 'STORMUSDT', 'LENDBTC', 'LENDUSDT', 'LENDBUSD',
                'ERDBTC', 'ERDUSDT', 'ERDBUSD', 'MCOBTC', 'MCOUSDT', 'STRATBTC', 'STRATUSDT', 'STRATBUSD',
                'VTHOBUSD', 'DCRBUSD', 'NPXSBTC', 'NPXSUSDT', 'BLZBUSD', 'WNXMBUSD', 'AIONBUSD', 'KMDBUSD',
                'XZCBT', 'XZCUSDT', 'IRISBUSD', 'HCBTC', 'HCUSDT', 'KEYBTC', 'KEYUSDT', 'TROYBTC', 'SUSDBTC',
                'TRUBUSD', 'BOOTBTC', 'BOTBUSD', 'PXGBUSD', 'BTSBUSD',
            ];
            let exceptionflag = false;
            exceptionArr.map((symbolName) => {
                if (name.symbol === symbolName) {
                    exceptionflag = true
                    return;
                }
            })
            if (exceptionflag === true)
                return coinStateDatas;

            if (name.symbol.lastIndexOf('BTC') !== -1) {
                len = name.symbol.indexOf('BTC');
                moneySym = 'BTC';
            } else if (name.symbol.lastIndexOf('USDT') !== -1) {
                len = name.symbol.indexOf('USDT');
                moneySym = 'USDT';
            } else if (name.symbol.lastIndexOf('BUSD') !== -1) {
                len = name.symbol.indexOf('BUSD');
                moneySym = 'BUSD';
            }
            coin = name.symbol.slice(0, len);

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

            if (moneySym === 'BTC') {
                cal = (parseFloat(coinStateDatas['BTC'].upbitPrice) * parseFloat(nowPrice)).toFixed(1)

                if (sortOrder[0] === 'upbitBTC')
                    calper = ((cal - parseFloat(coinStateDatas[coin].calKoupbitBTC)) / cal * 100).toFixed(2)
                else if (sortOrder[0] === "upbitUSDT")
                    calper = ((cal - parseFloat(coinStateDatas[coin].calKoupbitBTC)) / cal * 100).toFixed(2)
                else if (sortOrder[0] === 'upbitSym')
                    calper = ((cal - parseFloat(coinStateDatas[coin].upbitPrice)) / cal * 100).toFixed(2)

                if (coin !== "") {
                    coinStateDatas[coin] = {
                        ...coinStateDatas[coin],
                        binanBTCSym: name.symbol,
                        binanBTCPrice: nowPrice,
                        calKobinanBTC: cal,
                        binBTC_start_per: calper
                    }
                }
            } else if (moneySym === 'USDT') {
                cal = (parseFloat(coinStateDatas['USDT'].upbitUSDTPrice) * parseFloat(nowPrice)).toFixed(1);

                if (sortOrder[0] === 'upbitBTC')
                    calper = ((cal - parseFloat(coinStateDatas[coin].calKoupbitBTC)) / cal * 100).toFixed(2)
                else if (sortOrder[0] === "upbitUSDT")
                    calper = ((cal - parseFloat(coinStateDatas[coin].calKoupbitUSDT)) / cal * 100).toFixed(2)
                else if (sortOrder[0] === 'upbitSym')
                    calper = ((cal - parseFloat(coinStateDatas[coin].upbitPrice)) / cal * 100).toFixed(2)

                if (coin !== "") {
                    coinStateDatas[coin] = {
                        ...coinStateDatas[coin],
                        binanUSDTSym: name.symbol,
                        binanUSDTPrice: nowPrice,
                        calKoUSDT: cal,
                        binUSDT_start_per: calper,
                    }
                }
            } else if (moneySym === 'BUSD') {
                cal = (parseFloat(coinStateDatas['USDT'].upbitUSDTPrice) * parseFloat(nowPrice)).toFixed(1);

                if (sortOrder[0] === 'upbitBTC')
                    calper = ((cal - parseFloat(coinStateDatas[coin].calKoupbitBTC)) / cal * 100).toFixed(2)
                else if (sortOrder[0] === "upbitUSDT")
                    calper = ((cal - parseFloat(coinStateDatas[coin].calKoupbitUSDT)) / cal * 100).toFixed(2)
                else if (sortOrder[0] === 'upbitSym')
                    calper = ((cal - parseFloat(coinStateDatas[coin].upbitPrice)) / cal * 100).toFixed(2)

                if (coin !== "") {
                    coinStateDatas[coin] = {
                        ...coinStateDatas[coin],
                        binanBNBSym: name.symbol,
                        binanBNBPrice: nowPrice,
                        calKoBUSD: cal,
                        binBUSD_start_per: calper,
                    }
                }
            }
            //📌 EXCEPTION
            if (name.symbol === 'BTCBUSD') {
                coinStateDatas['BTC'] = {
                    ...coinStateDatas['BTC'],
                    binanBNBSym: name.symbol,
                    binanBNBPrice: nowPrice
                }
            } else if (name.symbol === 'BTCUSDT') {
                cal = (parseFloat(coinStateDatas['USDT'].upbitUSDTPrice) * parseFloat(nowPrice)).toFixed(1)
                coinStateDatas['BTC'] = {
                    ...coinStateDatas['BTC'],
                    binanUSDTSym: name.symbol,
                    binanUSDTPrice: nowPrice,
                    calKoUSDT: cal,
                    per: ((cal - parseFloat(coinStateDatas['BTC'].upbitPrice)) / cal * 100).toFixed(2)
                }
            }
        });

        //✅ Max per search
        Object.keys(coinStateDatas).forEach((coin) => {
            var read = coinStateDatas[coin];
            var keyread = Object.keys(read);
            var maxPer = 0.0;
            var minPer = 0.0;
            keyread.forEach((name) => {
                var per;
                if (name === 'bithumbKRW_start_per') {
                    per = parseFloat(coinStateDatas[coin].bithumbKRW_start_per);
                }
                else if (name === 'binBUSD_start_per') {
                    per = parseFloat(coinStateDatas[coin].binBUSD_start_per);
                } else if (name === 'upbitBTC_start_per') {
                    per = parseFloat(coinStateDatas[coin].upbitBTC_start_per);
                } else if (name === 'upbitUSDT_start_per') {
                    per = parseFloat(coinStateDatas[coin].upbitUSDT_start_per);
                } else if (name === 'BTCper') {
                    per = parseFloat(coinStateDatas[coin].BTCper);
                } else if (name === 'binUSDT_start_per') {
                    per = parseFloat(coinStateDatas[coin].binUSDT_start_per);
                }
                else if (name === 'binBTC_start_per') {
                    per = parseFloat(coinStateDatas[coin].binBTC_start_per);
                }
                if (per > maxPer) {
                    maxPer = per;
                }
                if (per < minPer) {
                    minPer = per;
                }
            })
            coinStateDatas[coin] = {
                ...coinStateDatas[coin],
                totalPer: maxPer,
                totalminPer: minPer
            }
        });

        //📦 v2
        Object.keys(coinStateDatas).forEach((coin) => {
            var read = coinStateDatas[coin];
            var keyread = Object.keys(read);
            var maxPer = 0.0;
            var minPer = Number.MAX_SAFE_INTEGER;
            var sortExchange = [];
            var minExchange;
            var lastminExchange;

            /*
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
                if (!sortOrder[0] && !sortOrder[1]) {
                    sortOrder.splice(0, 2);
                }
                else if (!sortOrder[0]) {
                    sortOrder.splice(0, 1);
                }
                else if (!sortOrder[1]) {
                    sortOrder.splice(1, 1);
                }
            }*/

            keyread.forEach((name) => {
                var price;
                if (name === 'upbitPrice') {
                    price = parseFloat(coinStateDatas[coin].upbitPrice);
                    sortExchange.push('upbit');
                    minExchange = 'upbitWithdraw';
                }
                else if (name === 'bithumbPrice') {
                    price = parseFloat(coinStateDatas[coin].bithumbPrice);
                    sortExchange.push('bithumb');
                    minExchange = 'bithumbWithdraw';
                }
                else if (name === 'calKoupbitBTC') {
                    price = parseFloat(coinStateDatas[coin].calKoupbitBTC);
                    sortExchange.push('upbit');
                    minExchange = 'upbitWithdraw';
                }
                else if (name === 'calKobithumbBTC') {
                    price = parseFloat(coinStateDatas[coin].calKobithumbBTC);
                    //ok
                    sortExchange.push('bithumb');
                    minExchange = 'bithumbWithdraw';
                } else if (name === 'calKobinanBTC') {
                    price = parseFloat(coinStateDatas[coin].calKobinanBTC);
                    sortExchange.push('binance');
                    minExchange = 1;
                } else if (name === 'calKoupbitUSDT') {
                    price = parseFloat(coinStateDatas[coin].calKoupbitUSDT);
                    sortExchange.push('upbit');
                } else if (name === 'calKoUSDT') {
                    price = parseFloat(coinStateDatas[coin].calKoUSDT);
                    sortExchange.push('binance');
                    minExchange = 1;
                } else if (name === 'calKoBUSD') {
                    price = parseFloat(coinStateDatas[coin].calKoBUSD);
                    sortExchange.push('binance');
                    minExchange = 1;
                }
                else if (name === 'calKoupbitBTC') {
                    price = parseFloat(coinStateDatas[coin].calKoupbitBTC);
                    sortExchange.push('upbit');
                    minExchange = 'upbitWithdraw';
                }

                if (price > maxPer) {
                    maxPer = price;
                }
                if (price < minPer) {
                    minPer = price;
                    lastminExchange = minExchange;
                }
            })
            sortExchange = Array.from(new Set(sortExchange));
            /*if (coin === 'SUSHI') {
                console.log('price check', minPer, maxPer, minExchange);
            }*/
            var result = 0.0;
            if (sortExchange.length <= 1) {
                minPer = 0;
                maxPer = 0;
                result = 0;
            }
            else {
                CoinMarketData.find((name) => {
                    if (name.symbol === coin) {
                        if (lastminExchange === 'upbitWithdraw') {
                            if (name.upbitWithdraw !== 'NO')
                                minPer = (parseFloat(name.upbitWithdraw) * parseFloat(minPer)) + minPer;
                            else {
                                minPer = 0;
                                maxPer = 0;
                                result = 0;
                            }
                        } else if (lastminExchange === 'bithumbWithdraw') {
                            minPer = (parseFloat(name.bithumbWithdraw) * parseFloat(minPer)) + minPer;
                        }
                    }
                })
                result = ((maxPer - minPer) / minPer * 100).toFixed(1);
                if (result < 0) {
                    result = 0;
                }
            }

            coinStateDatas[coin] = {
                ...coinStateDatas[coin],
                testper: result
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
        data['USDT'] = {
            ...data['USDT'],
            upbitUSDTPrice: (data['BTC'].upbitPrice / data['BTC'].upbitUSDTPrice).toFixed(1),
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
                    calKobithumbBTC: (parseFloat(coinStateDatas['BTC'].upbitPrice) * parseFloat(names[name].korean)).toFixed(2)
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