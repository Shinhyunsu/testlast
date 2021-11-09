
import axios from "axios";
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
                /*if (newCoin === false) {
                    console.log(coinName, type);
                }*/
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
    mixExchangeUpdates: (one_names, two_names, three_names, state) => {
        const coinStateDatas = state.Coin.marketNames.data;
        const TOPmarketNames = state.Coin.TOPmarketNames;
        const TOPmarketString = state.Coin.TOPmarketString;
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

                var origin = parseFloat(coinStateDatas['BTC'].bithumbPrice);
                cal = (origin * parseFloat(nowPrice)).toFixed(2);
                coinStateDatas[shortSym] = {
                    ...coinStateDatas[shortSym],
                    bithumbBTCPrice: nowPrice,
                    calKobithumbBTC: cal
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
                'TRUBUSD', 'BOOTBTC', 'BOTBUSD', 'PXGBUSD', 'BTSBUSD', 'RENBTCBTC', 'RENBTCETH'
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
            var exchange;
            var lastminExchange, lastmaxExchange;
            var minmaxExchange, maxExchange, minExchange;

            keyread.forEach((name) => {
                var price;
                if (name === 'upbitPrice') {
                    price = parseFloat(coinStateDatas[coin].upbitPrice);
                    sortExchange.push('upbit');
                    exchange = 'upbitWithdraw';
                    minmaxExchange = 'upbitKRW';
                }
                else if (name === 'bithumbPrice') {
                    price = parseFloat(coinStateDatas[coin].bithumbPrice);
                    sortExchange.push('bithumb');
                    exchange = 'bithumbWithdraw';
                    minmaxExchange = 'bithumbKRW';
                }
                else if (name === 'calKoupbitBTC') {
                    price = parseFloat(coinStateDatas[coin].calKoupbitBTC);
                    sortExchange.push('upbit');
                    exchange = 'upbitWithdraw';
                    minmaxExchange = 'upbitBTC';
                }
                else if (name === 'calKobithumbBTC') {
                    price = parseFloat(coinStateDatas[coin].calKobithumbBTC);
                    //ok
                    sortExchange.push('bithumb');
                    exchange = 'bithumbWithdraw';
                    minmaxExchange = 'bithumbBTC';
                } else if (name === 'calKobinanBTC') {
                    price = parseFloat(coinStateDatas[coin].calKobinanBTC);
                    sortExchange.push('binance');
                    exchange = 'binanceWithdraw';
                    minmaxExchange = 'binanceBTC';
                } else if (name === 'calKoupbitUSDT') {
                    price = parseFloat(coinStateDatas[coin].calKoupbitUSDT);
                    sortExchange.push('upbit');
                    minmaxExchange = 'upbitUSDT';
                } else if (name === 'calKoUSDT') {
                    price = parseFloat(coinStateDatas[coin].calKoUSDT);
                    sortExchange.push('binance');
                    exchange = 'binanceWithdraw';
                    minmaxExchange = 'binanceUSDT';
                } else if (name === 'calKoBUSD') {
                    price = parseFloat(coinStateDatas[coin].calKoBUSD);
                    sortExchange.push('binance');
                    exchange = 'binanceWithdraw';
                    minmaxExchange = 'binanceBUSD';
                }

                if (price > maxPer) {
                    maxPer = price;
                    maxExchange = minmaxExchange
                    lastmaxExchange = exchange;
                }
                if (price < minPer) {
                    minPer = price;
                    minExchange = minmaxExchange
                    lastminExchange = exchange;
                }
            })
            sortExchange = Array.from(new Set(sortExchange));


            var result = 0.0;
            if (sortExchange.length <= 1) {
                minPer = 0;
                maxPer = 0;
                result = 0;
            }
            else {
                CoinMarketData.find((name) => {
                    if (name.symbol === coin) {
                        if (lastminExchange === 'bithumbWithdraw' && lastmaxExchange === 'bithumbWithdraw') {
                            minPer = 0;
                            maxPer = 0;
                            result = 0;
                            return;
                        }
                        else if (lastminExchange === 'upbitWithdraw') {
                            if (name.upbitWithdraw !== 'NO')
                                minPer = (parseFloat(name.upbitWithdraw) * parseFloat(minPer)) + minPer;
                            else {
                                minPer = 0;
                                maxPer = 0;
                                result = 0;
                                return;
                            }
                        } else if (lastminExchange === 'bithumbWithdraw') {
                            minPer = (parseFloat(name.bithumbWithdraw) * parseFloat(minPer)) + minPer;
                        }
                        else if (lastminExchange === 'binanceWithdraw') {
                            if (name.upbitWithdraw !== 'NO')
                                minPer = (parseFloat(name.binanceWithdraw) * parseFloat(minPer)) + minPer;
                            else {
                                minPer = 0;
                                maxPer = 0;
                                result = 0;
                                return;
                            }
                        }
                    }
                })
                if (!(minPer <= 0 || maxPer === 0))
                    result = ((maxPer - minPer) / minPer * 100).toFixed(1);
                else {
                    result = 0;
                }
            }
            coinStateDatas[coin] = {
                ...coinStateDatas[coin],
                testper: result,
                symbol: coin,
                minExchange: minExchange,
                maxExchange: maxExchange,
            }
        });

        //!
        TOPmarketNames.splice(0);
        var coinStateCount = 0;
        var coinStringMake = "";
        Object.keys(coinStateDatas).forEach((coinOne) => {
            if (coinStateDatas[coinOne].testper > 0) {
                coinStringMake += coinOne + ",";
                var dataFactory = [];
                var keyread = Object.keys(coinStateDatas[coinOne])
                var arrCount = 0;
                keyread.forEach((name) => {
                    if (name === 'upbitPrice') {
                        dataFactory[arrCount] = {
                            'MainSym': coinOne,
                            'sym': coinStateDatas[coinOne].upbitSym,
                            'exchange': 'upbit',
                            'OriginPrice': coinStateDatas[coinOne].upbitPrice,
                            'KrwPrice': coinStateDatas[coinOne].upbitPrice

                        }
                        arrCount++;
                    }
                    else if (name === 'bithumbSym') {
                        dataFactory[arrCount] = {
                            'MainSym': coinOne,
                            'sym': coinStateDatas[coinOne].bithumbSym,
                            'exchange': 'bithumb',
                            'OriginPrice': coinStateDatas[coinOne].bithumbPrice,
                            'KrwPrice': coinStateDatas[coinOne].bithumbPrice
                        }
                        arrCount++;
                    }
                    else if (name === 'calKoupbitBTC') {
                        dataFactory[arrCount] = {
                            'MainSym': coinOne,
                            'sym': coinStateDatas[coinOne].upbitBTC,
                            'exchange': 'upbit',
                            'OriginPrice': coinStateDatas[coinOne].upbitBTCPrice,
                            'KrwPrice': coinStateDatas[coinOne].calKoupbitBTC
                        }
                        arrCount++;
                    }
                    else if (name === 'calKobithumbBTC') {
                        dataFactory[arrCount] = {
                            'MainSym': coinOne,
                            'sym': coinStateDatas[coinOne].bithumbBTC,
                            'exchange': 'bithumb',
                            'OriginPrice': coinStateDatas[coinOne].bithumbBTCPrice,
                            'KrwPrice': coinStateDatas[coinOne].calKobithumbBTC
                        }
                        arrCount++;
                    }
                    else if (name === 'calKoupbitUSDT') {
                        dataFactory[arrCount] = {
                            'MainSym': coinOne,
                            'sym': coinStateDatas[coinOne].upbitUSDT,
                            'exchange': 'upbit',
                            'OriginPrice': coinStateDatas[coinOne].upbitUSDTPrice,
                            'KrwPrice': coinStateDatas[coinOne].calKoupbitUSDT
                        }
                        arrCount++;
                    }
                    else if (name === 'calKobinanBTC') {
                        dataFactory[arrCount] = {
                            'MainSym': coinOne,
                            'sym': coinStateDatas[coinOne].binanBTCSym,
                            'exchange': 'binance',
                            'OriginPrice': coinStateDatas[coinOne].binanBTCPrice,
                            'KrwPrice': coinStateDatas[coinOne].calKobinanBTC
                        }
                        arrCount++;
                    }
                    else if (name === 'calKoUSDT') {
                        dataFactory[arrCount] = {
                            'MainSym': coinOne,
                            'sym': coinStateDatas[coinOne].binanUSDTSym,
                            'exchange': 'binance',
                            'OriginPrice': coinStateDatas[coinOne].binanUSDTPrice,
                            'KrwPrice': coinStateDatas[coinOne].calKoUSDT
                        }
                        arrCount++;
                    }
                    else if (name === 'calKoBUSD') {
                        dataFactory[arrCount] = {
                            'MainSym': coinOne,
                            'sym': coinStateDatas[coinOne].binanBNBSym,
                            'exchange': 'binance',
                            'OriginPrice': coinStateDatas[coinOne].binanBNBPrice,
                            'KrwPrice': coinStateDatas[coinOne].calKoBUSD
                        }
                        arrCount++;
                    }

                });
                //console.log('before', dataFactory); //1 2 3 4 5 
                dataFactory = dataFactory.sort((next, prev) => {

                    if (parseFloat(next.KrwPrice) > parseFloat(prev.KrwPrice)) {
                        return -1;
                    } else {
                        return 0;
                    }
                })

                TOPmarketNames[coinStateCount] = dataFactory;//coinStateDatas[coinOne]
                coinStateCount++;
            }
        })
        TOPmarketString[0] = { 'ALL': coinStringMake }

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


        //!


        return coinStateDatas;
    }
};


export {
    coinListDataUtils,
    coinReadDataUtils
}