import { call, put, select, flush, delay } from "redux-saga/effects";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { buffers, eventChannel, END } from "redux-saga";
import encoding from "text-encoding";

import { upbitmarket } from "../Api/api";

import { coinReadDataUtils } from "./utils";

import axios from "axios";
import { binancecoinApi, kucoinApi, coinoneApi, huobiApi, gateioApi, bithumbcoinApi } from "../Api/api";
import { conforms } from "lodash";
import CoinMarketData from "../Api/CoinMarketData.json";
const createRequestSaga = (type, api, dataMaker) => {
    const SUCCESS = `${type}_SUCCESS`;
    const ERROR = `${type}_ERROR`;

    return function* (action = {}) {
        var res;

        if (type === "GET_UPBIT_MARKET_PRICE_INIT") {

            const state = yield select();
            var coinString;
            Object.keys(state.Coin.upbitTotalNames.data).map((coin) => {
                coinString += coin + ","
            });

            coinString = coinString.slice(9, -1);

            res = yield call(() => axios.get(`https://api.upbit.com/v1/ticker?markets=${coinString}`), action.payload);
        }
        else {
            res = yield call(api, action.payload);

        }
        try {
            const state = yield select();
            if (type === "GET_UPBIT_MARKET_NAMES" || type === "GET_UPBIT_MARKET_PRICE_INIT" || type === "GET_BINANCE_MARKET_NAMES") {
                yield put({ type: SUCCESS, payload: dataMaker(res.data, state) });
            }
            else if (type === "GET_BITHUMB_MARKET_KRW_NAMES" || type === "GET_BITHUMB_MARKET_BTC_NAMES") {

                yield put({ type: SUCCESS, payload: dataMaker(res.data.data, state) });
            } else if (type === 'GET_KUCOIN_MARKET_NAMES') {
                yield put({ type: SUCCESS, payload: dataMaker(res.data.data, state) });
            }
        } catch (e) {
            yield put({ type: ERROR, payload: e });
            throw e;
        }
    };
};

const createInitRequestSaga = (type, dataMaker) => {
    const SUCCESS = `${type}_SUCCESS`;
    const ERROR = `${type}_ERROR`;

    return function* (action = {}) {
        try {
            const state = yield select();
            yield put({ type: SUCCESS, payload: dataMaker(action.payload, state) });

        } catch (e) {
            yield put({ type: ERROR, payload: e });
            throw e;
        }
    };
};


const requestActions = (type, key) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

    return (state, action) => {
        switch (action.type) {
            case SUCCESS:
                return reducerUtils.success(state, action.payload, key);
            case ERROR:
                return reducerUtils.error(state, action.payload, key);
            default:
                return state;
        }
    };
};

const reducerUtils = {
    success: (state, payload, key) => {
        return {
            ...state,
            [key]: {
                data: payload,
                error: false,
            },
        };
    },
    error: (state, error, key) => ({
        ...state,
        [key]: {
            ...state[key],
            error: error,
        },
    }),
};

const createUpbitSocket = () => {
    const client = new W3CWebSocket("wss://api.upbit.com/websocket/v1");
    client.binaryType = "arraybuffer";

    return client;
};
const createBithumbSocket = () => {
    const client = new W3CWebSocket("wss://pubwss.bithumb.com/pub/ws");
    client.binaryType = "arraybuffer";

    return client;
};


// 소켓 연결용
const connectSocekt = (socket, connectType, type, action, buffer) => {
    //console.log("action", action);
    return eventChannel((emit) => {
        socket.onopen = () => {
            socket.send(
                JSON.stringify([
                    { ticket: "coinbread-clone" },
                    { type: connectType, codes: action },
                ])
            );
        };
        socket.onmessage = (evt) => {
            const enc = new encoding.TextDecoder("utf-8");
            const data = JSON.parse(enc.decode(evt.data));
            emit(data);
        };

        socket.onerror = (evt) => {
            console.log("error", evt);
            emit(evt);
            emit(END);
        };

        const unsubscribe = () => {
            socket.close();
        };

        return unsubscribe;
    }, buffer || buffers.none());
};

const bitconnectSocekt = (socket, connectType, type, action, buffer) => {
    console.log("ttt", action);
    return eventChannel((eemit) => {
        socket.onopen = () => {
            socket.send(
                JSON.stringify(
                    { type: connectType, symbols: action, tickTypes: ["MID"] }
                )
            );
        };
        socket.onmessage = (evt) => {
            //console.log(evt.data);
            const data = JSON.parse(evt.data)
            if (data && data['type'] === 'ticker') {
                eemit(data['content']);
            }

        };

        socket.onerror = (evt) => {
            console.log("error", evt);
            eemit(evt);
            eemit(END);
        };

        const unsubscribe = () => {
            socket.close();
        };

        return unsubscribe;
    }, buffer || buffers.none());
};

const createConnectSocketSaga = (type, connectType, dataMaker) => {
    const SUCCESS = `${type}_SUCCESS`;
    const ERROR = `${type}_ERROR`;

    return function* (action = {}) {
        const state = yield select();

        const upbitTotalNames = Object.keys(state.Coin.upbitTotalNames.data);
        //const bithumbTotalNames = Object.keys(state.Coin.bithumbTotalNames.data);

        var client;
        //var bitclient;
        var clientChannel;
        //✅ new
        var bitclientChannel;

        client = yield call(createUpbitSocket);

        //bitclient = yield call(createBithumbSocket);

        clientChannel = yield call(
            connectSocekt,
            client,
            connectType,
            type,
            upbitTotalNames,
            buffers.expanding(500)
        );
        var err_coin = '';
        //✅ new
        /*bitclientChannel = yield call(
            bitconnectSocekt,
            bitclient,
            connectType,
            type,
            bithumbTotalNames,
            buffers.expanding(1000)
        );*/

        try {
            while (true) {
                const datas = yield flush(clientChannel); // 버퍼 데이터 가져오기
                //const bitdatas = yield flush(bitclientChannel);

                var sortedDATA;
                var sortedData;

                if (datas.length) {
                    //console.log(datas);
                    var sortedObj = {};
                    datas.forEach((data) => {
                        if (sortedObj[data.code]) {
                            // 버퍼에 있는 데이터중 시간이 가장 최근인 데이터만 남김
                            sortedObj[data.code] =
                                sortedObj[data.code].timestamp > data.timestamp
                                    ? sortedObj[data.code]
                                    : data;
                        } else {
                            sortedObj[data.code] = data;
                        }
                        sortedObj[data.code] = data;
                    });

                    sortedDATA = Object.keys(sortedObj).map(
                        (data) => sortedObj[data]
                    );
                    /*
                                        if (bitdatas.length) {
                                            var sortedObj = {};
                                            bitdatas.forEach((data) => {
                                                if (sortedObj[data.code]) {
                                                    // 버퍼에 있는 데이터중 시간이 가장 최근인 데이터만 남김
                                                    sortedObj[data.symbol] =
                                                        sortedObj[data.symbol].time > data.time
                                                            ? sortedObj[data.symbol]
                                                            : data;
                                                } else {
                                                    sortedObj[data.symbol] = data;
                                                }
                                                sortedObj[data.symbol] = data;
                                            });
                                            sortedData = Object.keys(sortedObj).map(
                                                (data) => sortedObj[data]
                                            );*/





                    var binanceObj = yield call(binancecoinApi.getMarketCodes);
                    yield delay(100);
                    var kucoinObj = yield call(kucoinApi.getMarketCodes);
                    yield delay(100);
                    var coinoneObj = yield call(coinoneApi.getMarketCodes);
                    yield delay(100);
                    var huobiObj = yield call(huobiApi.getMarketCodes);
                    yield delay(100);
                    var gateioObj = yield call(gateioApi.getMarketCodes);
                    yield delay(100);

                    var bithumbKRWObj = yield call(bithumbcoinApi.getKRWMarketCodes);
                    yield delay(100);
                    var bithumbBTCObj = yield call(bithumbcoinApi.getBTCMarketCodes);
                    yield delay(100);

                    var Allobj = {};

                    Object.keys(bithumbKRWObj.data.data).forEach((bithumbKrw) => {
                        var withdrawCheck = CoinMarketData.findIndex((e) => e.symbol === bithumbKrw && e.bithumbWithdraw !== undefined)

                        if (withdrawCheck === -1) {
                            withdrawCheck = "NEW";
                            console.log(bithumbKrw, bithumbKRWObj.data.data[bithumbKrw]);
                        }

                        Allobj[bithumbKrw] = {
                            ...Allobj[bithumbKrw],
                            bithumbKRWPrice: bithumbKrw.closing_price,
                            bithumbKRWSym: bithumbKrw,
                            "bithumbWithdraw": withdrawCheck
                        };
                    })
                    Object.keys(bithumbBTCObj.data.data).forEach((bithumbBtc) => {
                        var withdrawCheck = CoinMarketData.findIndex((e) => e.symbol === bithumbBtc && e.bithumbWithdraw !== undefined)

                        if (withdrawCheck === -1) {
                            withdrawCheck = "NEW";
                            console.log(bithumbBtc, bithumbBTCObj.data.data[bithumbBtc]);
                        }

                        Allobj[bithumbBtc] = {
                            ...Allobj[bithumbBtc],
                            bithumbBTCPrice: bithumbBtc.closing_price,
                            bithumbBTCSym: bithumbBtc,
                            "bithumbWithdraw": withdrawCheck
                        };
                    })

                    var shortSym = '', moneySym = '', nowPrice = '', saveSym = '', doubleSymcheck = 0, saveCoinName = '';
                    Object.keys(sortedDATA).filter((upbitsym) => {
                        shortSym = sortedDATA[upbitsym].code.split("-")[1];
                        moneySym = sortedDATA[upbitsym].code.split("-")[0];
                        nowPrice = parseFloat(sortedDATA[upbitsym].trade_price);
                        var withdrawCheck = CoinMarketData.findIndex((e) => e.symbol === shortSym && e.upbitWithdraw !== undefined)

                        if (withdrawCheck === -1) {
                            withdrawCheck = "NEW";
                            console.log(withdrawCheck, upbitsym, sortedDATA[upbitsym]);
                        }


                        if (moneySym === "KRW") {
                            saveSym = "upbitKRWPrice";
                            saveCoinName = 'upbitKRWSym';
                            doubleSymcheck++;
                        } else if (moneySym === "USDT") {
                            saveSym = "upbitUSDTPrice";
                            saveCoinName = 'upbitUSDTSym';
                            doubleSymcheck++;
                        } else if (moneySym === "BTC") {
                            saveSym = "upbitBTCPrice";
                            saveCoinName = 'upbitBTCSym';
                            doubleSymcheck++;
                        } else {
                            moneySym = saveSym = ''
                        }
                        if (saveSym != '') {
                            Allobj[shortSym] = {
                                ...Allobj[shortSym],
                                [saveSym]: nowPrice,
                                [saveCoinName]: sortedDATA[upbitsym].code,
                                "upbitWithdraw": withdrawCheck
                            };
                            if (doubleSymcheck === 3) {
                                return;
                            }
                        }
                    })


                    var shortSym = '', moneySym = '', nowPrice = '', saveSym = '', len = 0, saveCoinName = '';
                    var doubleSymcheck = 0;
                    var exceptionflag = false;
                    Object.keys(binanceObj.data).forEach((binancesym) => {
                        var baseurl = binanceObj.data[binancesym]
                        let exceptionArr = ['VENUSDT', 'VENBTC', , 'MBLBTC',
                            'TUSDBTC', 'DAIBTC', 'REPBUSD', 'STORJBUSD', 'DENTBTC', 'MFTBTC',
                            'SUNBTC', 'BTTBTC', 'COCOSBTC', 'PAXBTC', 'PAXUSDT', 'PAXBUSD',
                            'BCHSVBTC', 'BCHSVUSDT', 'BCCBTC', 'BCCUSDT', 'HOTBTC', 'BCHABCBTC',
                            'BCHABCUSDT', 'BCHABCBUSD', 'STORMBTC', 'STORMUSDT', 'LENDBTC', 'LENDUSDT', 'LENDBUSD',
                            'ERDBTC', 'ERDUSDT', 'ERDBUSD', 'MCOBTC', 'MCOUSDT', 'STRATBTC', 'STRATUSDT', 'STRATBUSD',
                            'VTHOBUSD', 'DCRBUSD', 'NPXSBTC', 'NPXSUSDT', 'BLZBUSD', 'WNXMBUSD', 'AIONBUSD', 'KMDBUSD',
                            'XZCBT', 'XZCUSDT', 'IRISBUSD', 'HCBTC', 'HCUSDT', 'KEYBTC', 'KEYUSDT', 'TROYBTC', 'SUSDBTC',
                            'NBSBTC', 'PPTBTC', 'RCNBTC', 'DGDBTC', 'OSTBTC', 'BCHABUSD', 'SALTBTC', 'CHATBTC', 'TRUBUSD', 'BOOTBTC', 'BOTBUSD', 'PXGBUSD', 'BTSBUSD', 'RENBTCBTC', 'RENBTCETH',
                            'ETHBULL', 'ETHBEAR', 'EOSBULL', 'EOSBEAR', 'XRPBULL', 'XRPBEAR', 'BNBBULL', 'BNBBEAR', 'HSRBTC', 'SNGLSBTC', 'BQXBTC', 'ICNBTC', 'BCPTBTC', 'ARNBTC', 'CDTBTC', 'POEBTC', 'XZCBTC',
                            'FUELBTC', 'CMTBTC', 'TNBBTC', 'BRDBTC', 'EDOBTC', 'TRIGBTC', 'VIBEBTC', 'INSBTC', 'AEBTC', 'RPXBTC', 'SUBBTC', 'CLOAKBTC', 'GNTBTC', 'BCNBTC', 'AGIBTC', 'PHXBTC', 'BTCPAX', 'BNBUSDC', 'BTCUSDC',
                            'BNBUSDS', 'BTCUSDS', 'PHBUSDC', 'BTCBBTC', 'USDSBUSDT', 'BTCBUSD', 'BUSDUSDT', 'BUSDNGN', 'BTCNGN', 'BTCRUB', 'BUSDRUB', 'BTCTRY', 'BUSDTRY', 'USDTTRY', 'USDTRUB', 'BTCEUR', 'EURBUSD', 'EURUSDT', 'BULLUSDT',
                            'BULLBUSD', 'BEARUSDT', 'BEARBUSD', 'ETHBULLUSDT', 'ETHBEARUSDT', 'ETHBULLBUSD', 'EOSBULLBUSD', 'EOSBEARUSDT', 'EOSBEARBUSD', 'XRPBULLUSDT', 'XRPBULLBUSD', 'XRPBEARUSDT', 'XRPBEARBUSD', 'BNBBULLUSDT', 'BNBBULLBUSD', 'BNBBEARUSDT', 'BNBBEARBUSD',
                            'EOSUPUSDT', 'EOSDOWNUSDT', 'TRXUPUSDT', 'TRXDOWNUSDT', 'XRPUPUSDT', 'XRPDOWNUSDT', 'DOTUPUSDT', 'DOTDOWNUSDT', 'LTCUPUSDT', 'LTCDOWNUSDT', 'SXPUPUSDT', 'UNIUPUSDT', 'UNIDOWNUSDT', 'SXPDOWNUSDT', 'FILUPUSDT', 'FILDOWNUSDT', 'YFIUPUSDT', 'YFIDOWNUSDT',
                            'BCHUPUSDT', 'BCHDOWNUSDT', 'AAVEUPUSDT', 'AAVEDOWNUSDT', 'SUSHIUPUSDT', 'SUSHIDOWNUSDT', 'XLMUPUSDT', 'XLMDOWNUSDT', '1INCHUPUSDT', '1INCHDOWNUSDT', 'ETHBEARBUSD', 'EOSBULLUSDT', 'ETHUPUSDT', 'ETHDOWNUSDT', 'ADAUPUSDT', 'ADADOWNUSDT', 'LINKUPUSDT', 'LINKDOWNUSDT',
                            'BNBUPUSDT', 'BNBDOWNUSDT', 'XTZUPUSDT', 'XTZDOWNUSDT', 'BTCTUSD', 'BTCZAR', 'USDTZAR', 'BUSDZAR', 'BTCBKRW', 'BTCIDRT', 'USDTIDRT', 'BUSDIDRT', 'BTCUPUSDT', 'BTCDOWNUSDT', 'BKRWUSDT', 'BKRWBUSD', 'BTCBIDR', 'BUSDBIDR', 'USDTBIDR', 'USDTBKRW', 'BUSDBKRW', 'BTCDAI', 'USDTDAI',
                            'DLTBTC', 'BTCGBP', 'GBPBUSD', 'BTCUAH', 'USDTUAH', 'GBPUSDT', 'BTCAUD', 'BUSDDAI', 'WBTCBTC', 'WBTCETH', 'USDTNGN', 'BTCBRL', 'USDTBRL', 'BUSDBRL', 'BUSDBVND', 'USDTBVND', 'COVERBUSD', 'BTCVAI', 'BUSDVAI', 'EASYBTC', 'BTCGYEN', 'USDTGYEN', 'BUSDUAH', 'BTCUSDP', 'BNBUSDP',
                            'MCBTC', 'MCBUSD', 'MCUSDT', 'PLABTC', 'PLABUSD', 'PLAUSDT'
                        ];
                        exceptionflag = false;
                        exceptionArr.find((symbolName) => {
                            if (baseurl.symbol === symbolName) {
                                exceptionflag = true
                                return true;
                            }
                        })

                        if (exceptionflag === false) {
                            if (baseurl.symbol.lastIndexOf('BTC') !== -1) {
                                len = baseurl.symbol.indexOf('BTC');
                                moneySym = 'BTC';
                            } else if (baseurl.symbol.lastIndexOf('USDT') !== -1) {
                                len = baseurl.symbol.indexOf('USDT');
                                moneySym = 'USDT';
                            } else if (baseurl.symbol.lastIndexOf('BUSD') !== -1) {
                                len = baseurl.symbol.indexOf('BUSD');
                                moneySym = 'BUSD';
                            } else {
                                len = 0;
                                moneySym = '';
                            }

                            shortSym = baseurl.symbol.slice(0, len);
                            nowPrice = parseFloat(baseurl.price);

                            if (baseurl.symbol === 'BTCUSDT') {
                                moneySym = 'USDT';
                                shortSym = 'BTC';
                            } else if (baseurl.symbol === 'BTCBUSD') {
                                moneySym = 'BUSD';
                                shortSym = 'BTC';
                            } else if (baseurl.symbol === 'BTCSTBTC') {
                                moneySym = 'BTC';
                                shortSym = 'BTCST';
                            } else if (baseurl.symbol === 'BTCSTBUSD') {
                                moneySym = 'BUSD';
                                shortSym = 'BTCST';
                            } else if (baseurl.symbol === 'BTCSTUSDT') {
                                moneySym = 'USDT';
                                shortSym = 'BTCST';
                            }

                            if (moneySym === 'BTC' || moneySym === 'USDT' || moneySym === 'BUSD') {
                                var withdrawCheck = CoinMarketData.findIndex((e) => e.symbol === shortSym && e.binanceWithdraw !== undefined)

                                if (withdrawCheck === -1) {
                                    withdrawCheck = "NEW";
                                    console.log("binance", withdrawCheck, shortSym, baseurl.symbol);
                                }



                                if (moneySym === "USDT") {

                                    saveSym = "binanceUSDTPrice";
                                    saveCoinName = 'binanceUSDTSym';

                                    doubleSymcheck++;
                                }
                                if (moneySym === "BTC") {
                                    saveSym = "binanceBTCPrice";
                                    saveCoinName = 'binanceBTCSym';

                                    doubleSymcheck++;
                                } if (moneySym === "BUSD") {

                                    saveSym = "binanceBUSDPrice";
                                    saveCoinName = 'binanceBUSDSym';

                                    doubleSymcheck++;
                                }
                                if (saveSym != '') {
                                    Allobj[shortSym] = {
                                        ...Allobj[shortSym],
                                        [saveSym]: nowPrice,
                                        [saveCoinName]: baseurl.symbol,
                                        "binanceWithdraw": withdrawCheck
                                    };
                                    if (doubleSymcheck === 3) {
                                        return;
                                    }
                                }
                            }
                        }
                    })

                    var shortSym = '', moneySym = '', nowPrice = '', saveSym = '', saveCoinName = '';
                    var doubleSymcheck = 0;
                    Object.keys(kucoinObj.data.data.ticker).filter((kucoinsym) => {

                        shortSym = kucoinObj.data.data.ticker[kucoinsym].symbol.split("-")[0];
                        moneySym = kucoinObj.data.data.ticker[kucoinsym].symbol.split("-")[1];
                        nowPrice = parseFloat(kucoinObj.data.data.ticker[kucoinsym].last);

                        let exceptionArr = [
                            'LTC3L-USDT', 'ATOM3L-USDT', 'ATOM3S-USDT', 'EOS3L-USDT', 'LTC3S-USDT', 'AAVE3S-USDT', 'BTC3L-USDT', 'EOS3S-USDT', 'ETH3S-USDT', 'BTC3S-USDT', 'UNI3L-USDT', ' ETH3L-USDT', 'LUNA3S-USDT', 'DOT3S-USDT', 'AAVE3L-USDT', 'SUSHI3S-USDT', 'LUNA3L-USDT', 'SUSHI3L-USDT', 'UNIC-USDT',
                            'USDT-PAX', 'ETH3L-USDT', 'USDT-USDC', 'DOT3L-USDT', 'AXS3S-USDT', 'XRP3S-USDT', 'SAND3S-USDT', 'AXS3L-USDT', 'NEAR3L-USDT', 'SOL3S-USDT', 'XRP3L-USDT', 'NEAR3S-USDT', 'MATIC3L-USDT', 'SAND3L-USDT', 'SOL3L-USDT', 'FTM3L-USDT', 'GALAX3S-USDT', 'ADA3L-USDT', 'LINK3S-USDT', 'MATIC3S-USDT', 'LINK3L-USDT', 'ADA3S-USDT',
                            'FTM3S-USDT', 'DOGE3L-USDT', 'MANA3S-USDT', 'DOGE3S-USDT', 'VET3L-USDT', 'VET3S-USDT', 'GALAX3L-USDT', 'MANA3L-USDT', 'BNB3S-USDT', 'AVAX3S-USDT', 'BCH3L-USDT', 'BNB3L-USDT', 'AVAX3L-USDT', 'BCH3S-USDT', 'UNI3S-USDT', 'ETH2-ETH', 'LOKI-BTC', 'LOKI-ETH', 'MNET-USDT', 'LOKI-USDT', 'HARD-USDT', 'USDT-TUSD', 'NU-BTC',
                            'USDT-DAI', 'POND-BTC', 'NU-USDT', 'POND-USDT', 'NGC-USDT', 'R-USDT', 'USDT-UST', 'VR-USDT'
                        ];
                        exceptionflag = false;
                        exceptionArr.find((symbolName) => {
                            if (kucoinObj.data.data.ticker[kucoinsym].symbol === symbolName) {
                                exceptionflag = true
                                return true;
                            }
                        })

                        if (exceptionflag === false) {
                            if (shortSym === 'WAX') {
                                shortSym = 'WAXP';
                            } else if (shortSym === 'GALAX') {
                                shortSym = 'GALA';
                            }

                            var withdrawCheck = CoinMarketData.findIndex((e) => e.symbol === shortSym && e.kucoinWithdraw !== undefined)
                            if (withdrawCheck === -1) {
                                withdrawCheck = "NEW";
                                console.log("kucoin", withdrawCheck, shortSym, kucoinObj.data.data.ticker[kucoinsym].symbol);
                            }

                            if (moneySym === 'USDT') {
                                saveSym = "kucoinUSDTPrice";
                                saveCoinName = 'kucoinUSDTSym';
                                doubleSymcheck++;
                            }
                            else if (moneySym === 'BTC') {
                                saveSym = "kucoinBTCPrice";
                                saveCoinName = 'kucoinBTCSym';
                                doubleSymcheck++;
                            } else {
                                moneySym = saveSym = ''
                            }
                            if (saveSym != '') {
                                Allobj[shortSym] = {
                                    ...Allobj[shortSym],
                                    [saveSym]: nowPrice,
                                    [saveCoinName]: kucoinObj.data.data.ticker[kucoinsym].symbol,
                                    "kucoinWithdraw": withdrawCheck
                                };
                                if (doubleSymcheck === 2) {
                                    return;
                                }

                            }
                        }
                    })

                    var shortSym = '', nowPrice = '', saveSym = '';
                    var doubleSymcheck = 0;
                    Object.keys(coinoneObj.data).filter((coinonesym) => {
                        if (!(coinonesym === 'result' || coinonesym === 'errorCode' || coinonesym === 'timestamp' || coinonesym === 'bfc')) {
                            var withdrawCheck = CoinMarketData.findIndex((e) => e.symbol === coinonesym.toUpperCase() && e.coinoneWithdraw !== undefined)
                            if (withdrawCheck === -1) {
                                withdrawCheck = "NEW";
                                console.log("coinone", withdrawCheck, coinonesym.toUpperCase());
                            }

                            nowPrice = parseFloat(coinoneObj.data[coinonesym].last);
                            Allobj[coinonesym.toUpperCase()] = {
                                ...Allobj[coinonesym.toUpperCase()],
                                'coinoneKRWPrice': nowPrice,
                                "coinoneWithdraw": withdrawCheck,
                                "coinoneKRWSym": coinonesym.toUpperCase()
                            };
                            return;
                        }
                    })


                    var shortSym = '', moneySym = '', nowPrice = '', saveSym = '', len = 0, saveCoinName = '';
                    var doubleSymcheck = 0;
                    Object.keys(huobiObj.data.data).filter((huobisym) => {
                        var readSym = huobiObj.data.data[huobisym].symbol;
                        nowPrice = huobiObj.data.data[huobisym].close;
                        if (readSym != 'btcusdt') {
                            if (readSym.lastIndexOf('btc') !== -1) {
                                len = readSym.indexOf('btc');
                                moneySym = 'BTC';
                            } else if (readSym.lastIndexOf('usdt') !== -1) {
                                len = readSym.indexOf('usdt');
                                moneySym = 'USDT';
                            } else {
                                len = 0
                                moneySym = '';
                            }
                        } else {
                            shortSym = readSym.slice(0, 3).toUpperCase();

                        }
                        if (len != 0) {
                            shortSym = readSym.slice(0, len).toUpperCase();

                            let exceptionArr = [
                                'BCH3L', 'LTC3L', 'ETH3S', 'LINK3L', 'XRP3L', 'ZEC3S', 'EOS3S', 'TRX3S', 'ETH3L', 'FIL3L', 'BCH3S', 'LTC3S', 'BSV3S', 'ZEC3L',
                                'LINK3S', 'DOT2S', 'USDC', 'UNI2L', 'XRP3S', 'EOS3L', 'TRX3L', 'DOT2L', 'FIL3S', 'UNI2S', 'BSV3L', 'BCH3L', 'LTC3L', 'LINK3S',
                                'XRP3L', 'FIL3L', 'DOT2L', 'BCH3S', 'UNI2L', 'ETH3S', 'EOS3S', 'ETH3L', 'EOS3L', 'ETH1S', 'DOT2S', 'UNI2S', 'FIL3S', 'LTC3S',
                                'XRP3S', 'LINK3L', 'BSV3L', 'ZEC3S', 'ZEC3L', 'BSV3S', 'TUSD', 'ALICE', 'W', 'IOTA', 'GTC', 'NH', 'GET'
                            ];
                            exceptionflag = false;
                            exceptionArr.find((symbolName) => {
                                if (shortSym === symbolName) {
                                    exceptionflag = true
                                    return true;
                                }
                            })
                            if (exceptionflag === false) {
                                var withdrawCheck = CoinMarketData.findIndex((e) => e.symbol === shortSym && e.huobiWithdraw !== undefined)

                                if (withdrawCheck === -1) {
                                    withdrawCheck = "NEW";
                                    console.log("huobi", withdrawCheck, shortSym);
                                }

                                if (moneySym === "USDT") {
                                    saveSym = "huobiUSDTPrice";
                                    saveCoinName = 'huobiUSDTSym';
                                    doubleSymcheck++;
                                }
                                else if (moneySym === "BTC") {
                                    saveSym = "huobiBTCPrice";
                                    saveCoinName = 'huobiBTCSym';
                                    doubleSymcheck++;
                                } else {
                                    moneySym = saveSym = ''
                                }
                                if (saveSym != '') {

                                    Allobj[shortSym] = {
                                        ...Allobj[shortSym],
                                        [saveSym]: nowPrice,
                                        "huobiWithdraw": withdrawCheck,
                                        [saveCoinName]: readSym,
                                    };
                                    if (doubleSymcheck === 2) {
                                        return;
                                    }

                                }
                            }
                        }
                    })


                    CoinMarketData.forEach((name) => {

                        Object.keys(name).forEach((checksym) => {
                            /*if (checksym === 'bithumbWithdraw') {
                                Object.keys(sortedData).filter((bitumbsym) => {
                                    var saveSym = '', saveCoinName = '';
                                    var shortSym = sortedData[bitumbsym].symbol.split("_")[0];
                                    var moneySym = sortedData[bitumbsym].symbol.split("_")[1];
                                    var nowPrice = parseFloat(sortedData[bitumbsym].closePrice);

                                    if (shortSym === name.symbol) {
                                        if (moneySym === "KRW") {
                                            saveSym = "bithumbKRWPrice";
                                            saveCoinName = 'bithumbKRWSym';
                                            doubleSymcheck++;
                                        } else if (moneySym === "BTC") {
                                            saveSym = "bithumbBTCPrice";
                                            saveCoinName = 'bithumbBTCSym';
                                            doubleSymcheck++;
                                        } else {
                                            moneySym = saveSym = ''
                                        }
                                        if (saveSym != '') {
                                            Allobj[shortSym] = {
                                                ...Allobj[shortSym],
                                                [saveSym]: nowPrice,
                                                [saveCoinName]: sortedData[bitumbsym].symbol,
                                                "bithumbWithdraw": name.bithumbWithdraw
                                            };
                                            if (doubleSymcheck === 2) {
                                                return;
                                            }
                                        }
                                    }
                                })
                            }*/
                            /*
                            if (checksym === 'upbitWithdraw') {
                                var shortSym = '', moneySym = '', nowPrice = '', saveSym = '', doubleSymcheck = 0, saveCoinName = '';
                                Object.keys(sortedDATA).filter((upbitsym) => {
                                    shortSym = sortedDATA[upbitsym].code.split("-")[1];
                                    moneySym = sortedDATA[upbitsym].code.split("-")[0];
                                    nowPrice = parseFloat(sortedDATA[upbitsym].trade_price);

                                    if (shortSym === name.symbol) {
                                        if (moneySym === "KRW") {
                                            saveSym = "upbitKRWPrice";
                                            saveCoinName = 'upbitKRWSym';
                                            doubleSymcheck++;
                                        } else if (moneySym === "USDT") {
                                            saveSym = "upbitUSDTPrice";
                                            saveCoinName = 'upbitUSDTSym';
                                            doubleSymcheck++;
                                        } else if (moneySym === "BTC") {
                                            saveSym = "upbitBTCPrice";
                                            saveCoinName = 'upbitBTCSym';
                                            doubleSymcheck++;
                                        } else {
                                            moneySym = saveSym = ''
                                        }
                                        if (saveSym != '') {
                                            Allobj[shortSym] = {
                                                ...Allobj[shortSym],
                                                [saveSym]: nowPrice,
                                                [saveCoinName]: sortedDATA[upbitsym].code,
                                                "upbitWithdraw": name.upbitWithdraw
                                            };
                                            if (doubleSymcheck === 3) {
                                                return;
                                            }
                                        }
                                    }
                                })
                            }*/
                            /*
                            if (checksym === 'binanceWithdraw') {
                                var shortSym = '', moneySym = '', nowPrice = '', saveSym = '', len = 0, saveCoinName = '';
                                var doubleSymcheck = 0;
                                var exceptionflag = false;
                                Object.keys(binanceObj.data).forEach((binancesym) => {
                                    var baseurl = binanceObj.data[binancesym]
                                    let exceptionArr = ['VENUSDT', 'VENBTC', , 'MBLBTC',
                                        'TUSDBTC', 'DAIBTC', 'REPBUSD', 'STORJBUSD', 'DENTBTC', 'MFTBTC',
                                        'SUNBTC', 'BTTBTC', 'COCOSBTC', 'PAXBTC', 'PAXUSDT', 'PAXBUSD',
                                        'BCHSVBTC', 'BCHSVUSDT', 'BCCBTC', 'BCCUSDT', 'HOTBTC', 'BCHABCBTC',
                                        'BCHABCUSDT', 'BCHABCBUSD', 'STORMBTC', 'STORMUSDT', 'LENDBTC', 'LENDUSDT', 'LENDBUSD',
                                        'ERDBTC', 'ERDUSDT', 'ERDBUSD', 'MCOBTC', 'MCOUSDT', 'STRATBTC', 'STRATUSDT', 'STRATBUSD',
                                        'VTHOBUSD', 'DCRBUSD', 'NPXSBTC', 'NPXSUSDT', 'BLZBUSD', 'WNXMBUSD', 'AIONBUSD', 'KMDBUSD',
                                        'XZCBT', 'XZCUSDT', 'IRISBUSD', 'HCBTC', 'HCUSDT', 'KEYBTC', 'KEYUSDT', 'TROYBTC', 'SUSDBTC',
                                        'NBSBTC', 'PPTBTC', 'RCNBTC', 'DGDBTC', 'OSTBTC', 'BCHABUSD', 'SALTBTC', 'CHATBTC', 'TRUBUSD', 'BOOTBTC', 'BOTBUSD', 'PXGBUSD', 'BTSBUSD', 'RENBTCBTC', 'RENBTCETH'
                                    ];
                                    exceptionflag = false;
                                    exceptionArr.find((symbolName) => {
                                        if (baseurl.symbol === symbolName) {
                                            exceptionflag = true
                                            return true;
                                        }
                                    })

                                    if (exceptionflag === false) {
                                        if (baseurl.symbol.lastIndexOf('BTC') !== -1) {
                                            len = baseurl.symbol.indexOf('BTC');
                                            moneySym = 'BTC';
                                        } else if (baseurl.symbol.lastIndexOf('USDT') !== -1) {
                                            len = baseurl.symbol.indexOf('USDT');
                                            moneySym = 'USDT';
                                        } else if (baseurl.symbol.lastIndexOf('BUSD') !== -1) {
                                            len = baseurl.symbol.indexOf('BUSD');
                                            moneySym = 'BUSD';
                                        } else {
                                            len = 0;
                                            moneySym = '';
                                        }

                                        shortSym = baseurl.symbol.slice(0, len);
                                        nowPrice = parseFloat(baseurl.price);

                                        if (baseurl.symbol === 'BTCUSDT') {
                                            moneySym = 'USDT';
                                            shortSym = 'BTC';
                                        } else if (baseurl.symbol === 'BTCBUSD') {
                                            moneySym = 'BUSD';
                                            shortSym = 'BTC';
                                        }
                                        if (shortSym === name.symbol) {

                                            if (moneySym === "USDT") {

                                                saveSym = "binanceUSDTPrice";
                                                saveCoinName = 'binanceUSDTSym';

                                                doubleSymcheck++;
                                            }
                                            if (moneySym === "BTC") {
                                                saveSym = "binanceBTCPrice";
                                                saveCoinName = 'binanceBTCSym';

                                                doubleSymcheck++;
                                            } if (moneySym === "BUSD") {

                                                saveSym = "binanceBUSDPrice";
                                                saveCoinName = 'binanceBUSDSym';

                                                doubleSymcheck++;
                                            }
                                            if (saveSym != '') {
                                                Allobj[shortSym] = {
                                                    ...Allobj[shortSym],
                                                    [saveSym]: nowPrice,
                                                    [saveCoinName]: baseurl.symbol,
                                                    "binanceWithdraw": name.binanceWithdraw
                                                };
                                                if (doubleSymcheck === 3) {
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                })
                            }*/
                            //if (shortSym === 'XRP' && moneySym === 'BTC')
                            //console.log("12", Allobj['XRP'])
                            /*
                                                        if (checksym === 'kucoinWithdraw') {
                                                            var shortSym = '', moneySym = '', nowPrice = '', saveSym = '', saveCoinName = '';
                                                            var doubleSymcheck = 0;
                                                            Object.keys(kucoinObj.data.data.ticker).filter((kucoinsym) => {
                            
                                                                shortSym = kucoinObj.data.data.ticker[kucoinsym].symbol.split("-")[0];
                                                                moneySym = kucoinObj.data.data.ticker[kucoinsym].symbol.split("-")[1];
                                                                nowPrice = parseFloat(kucoinObj.data.data.ticker[kucoinsym].last);
                            
                                                                if (shortSym === name.symbol) {
                            
                                                                    if (moneySym === 'USDT') {
                                                                        saveSym = "kucoinUSDTPrice";
                                                                        saveCoinName = 'kucoinUSDTSym';
                                                                        doubleSymcheck++;
                                                                    }
                                                                    else if (moneySym === 'BTC') {
                                                                        saveSym = "kucoinBTCPrice";
                                                                        saveCoinName = 'kucoinBTCSym';
                                                                        doubleSymcheck++;
                                                                    } else {
                                                                        moneySym = saveSym = ''
                                                                    }
                                                                    if (saveSym != '') {
                                                                        Allobj[shortSym] = {
                                                                            ...Allobj[shortSym],
                                                                            [saveSym]: nowPrice,
                                                                            [saveCoinName]: kucoinObj.data.data.ticker[kucoinsym].symbol,
                                                                            "kucoinWithdraw": name.kucoinWithdraw
                                                                        };
                                                                        if (doubleSymcheck === 2) {
                                                                            return;
                                                                        }
                                                                    }
                                                                }
                                                            })
                                                        }*/
                            /*if (checksym === 'coinoneWithdraw') {
                                var shortSym = '', nowPrice = '', saveSym = '';
                                var doubleSymcheck = 0;
                                Object.keys(coinoneObj.data).filter((coinonesym) => {
                                    if (!(coinonesym === 'result' || coinonesym === 'errorCode' || coinonesym === 'timestamp')) {
                                        if (coinonesym.toUpperCase() === name.symbol) {

                                            nowPrice = parseFloat(coinoneObj.data[coinonesym].last);
                                            Allobj[coinonesym.toUpperCase()] = {
                                                ...Allobj[coinonesym.toUpperCase()],
                                                'coinoneKRWPrice': nowPrice,
                                                "coinoneWithdraw": name.coinoneWithdraw,
                                                "coinoneKRWSym": coinonesym.toUpperCase()
                                            };
                                            return;
                                        }

                                    }
                                })
                            }*//*
                            if (checksym === 'huobiWithdraw') {
                                var shortSym = '', moneySym = '', nowPrice = '', saveSym = '', len = 0, saveCoinName = '';
                                var doubleSymcheck = 0;
                                Object.keys(huobiObj.data.data).filter((huobisym) => {
                                    var readSym = huobiObj.data.data[huobisym].symbol;
                                    nowPrice = huobiObj.data.data[huobisym].close;
                                    if (readSym != 'btcusdt') {
                                        if (readSym.lastIndexOf('btc') !== -1) {
                                            len = readSym.indexOf('btc');
                                            moneySym = 'BTC';
                                        } else if (readSym.lastIndexOf('usdt') !== -1) {
                                            len = readSym.indexOf('usdt');
                                            moneySym = 'USDT';
                                        } else {
                                            len = 0
                                            moneySym = '';
                                        }
                                    } else {
                                        shortSym = readSym.slice(0, 3).toUpperCase();

                                    }
                                    if (len != 0) {
                                        shortSym = readSym.slice(0, len).toUpperCase();
                                        if (shortSym === name.symbol) {
                                            if (moneySym === "USDT") {
                                                saveSym = "huobiUSDTPrice";
                                                saveCoinName = 'huobiUSDTSym';
                                                doubleSymcheck++;
                                            }
                                            else if (moneySym === "BTC") {
                                                saveSym = "huobiBTCPrice";
                                                saveCoinName = 'huobiBTCSym';
                                                doubleSymcheck++;
                                            } else {
                                                moneySym = saveSym = ''
                                            }
                                            if (saveSym != '') {

                                                Allobj[shortSym] = {
                                                    ...Allobj[shortSym],
                                                    [saveSym]: nowPrice,
                                                    "huobiWithdraw": name.huobiWithdraw,
                                                    [saveCoinName]: readSym,
                                                };
                                                if (doubleSymcheck === 2) {
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                })
                            }*/

                            if (checksym === 'gateioWithdraw') {
                                var shortSym = '', moneySym = '', nowPrice = '', saveSym = '', saveCoinNamev = '';
                                var doubleSymcheck = 0;

                                Object.keys(gateioObj.data).filter((gateiosym) => {

                                    shortSym = gateioObj.data[gateiosym].currency_pair.split("_")[0];
                                    moneySym = gateioObj.data[gateiosym].currency_pair.split("_")[1];
                                    nowPrice = parseFloat(gateioObj.data[gateiosym].last);


                                    if (shortSym === name.symbol) {

                                        if (moneySym === 'USDT') {
                                            saveSym = "gateioUSDTPrice";
                                            saveCoinName = 'gateioUSDTSym';
                                            doubleSymcheck++;
                                        }
                                        else if (moneySym === 'BTC') {
                                            saveSym = "gateioBTCPrice";
                                            saveCoinName = 'gateioBTCSym';
                                            doubleSymcheck++;
                                        } else {
                                            moneySym = saveSym = ''
                                        }
                                        if (saveSym != '') {
                                            Allobj[shortSym] = {
                                                ...Allobj[shortSym],
                                                [saveSym]: nowPrice,
                                                [saveCoinName]: gateioObj.data[gateiosym].currency_pair,
                                                "gateioWithdraw": name.gateioWithdraw
                                            };
                                            if (doubleSymcheck === 2) {
                                                return;
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    })
                    //console.log(Allobj['BTC'])
                    yield put({
                        type: SUCCESS, payload: coinReadDataUtils.mixExchangeUpdates(Allobj, state)
                    });

                }

                yield delay(4000); // 500ms 동안 대기

                //✅ Server send
                /*
                                const TOPmarketString = state.Coin.TOPmarketString;
                                var readData = "";
                                TOPmarketString.map((read) => {
                                    readData = read.ALL;
                                })
                
                                axios.post('https://tradingviewslackshin.herokuapp.com/webhook', JSON.stringify({ arbitrage: readData }), {
                                    headers: {
                                        "Content-Type": `application/json`,
                                    },
                                });*/

            }
        } catch (e) {
            console.log(e);
            yield put({ type: ERROR, payload: e });
        } finally {
            clientChannel.close();
        }
    };
};
export {
    createRequestSaga,
    requestActions,
    createConnectSocketSaga,
    createInitRequestSaga,
}