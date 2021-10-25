import { call, put, select, flush, delay } from "redux-saga/effects";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { buffers, eventChannel, END } from "redux-saga";
import encoding from "text-encoding";

import { throttle } from "lodash";
import { coinReadDataUtils } from "./utils";

import axios from "axios";
import { binancecoinApi, geckoApi, upbitoinApi } from "../Api/api";

const createRequestSaga = (type, api, dataMaker) => {
    const SUCCESS = `${type}_SUCCESS`;
    const ERROR = `${type}_ERROR`;


    return function* (action = {}) {
        var res;
        const state = yield select();

        if (type === "GET_UPBIT_MARKET_PRICE_INIT") {
            var coinString;
            Object.keys(state.Coin.upbitTotalNames.data).map((coin) => {

                coinString += coin + ","
            });
            //✅ coinString 내용을 복사 해서 api getMarketPriceCodes 에 붙여넣기 함.... ;;
            coinString = coinString.slice(9, -1);
            res = yield call(api, action.payload);
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
                //console.log(res.data.data);
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

// requestActions(GET_MARKET_NAMES, "marketNames")(state, action);
const requestActions = (type, key) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

    return (state, action) => {
        //console.log(state, action);
        switch (action.type) {
            case SUCCESS:
                //console.log(15);
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
            //if (type === "CONNECT_UPBIT_SOCKET") {
            socket.send(
                JSON.stringify([
                    { ticket: "coinbread-clone" },
                    { type: connectType, codes: action },
                ])
            );
            //} 
            /*else if (type === "CONNECT_BITHUMB_SOCKET") {
                socket.send(
                    JSON.stringify(
                        { type: connectType, symbols: action.payload, tickTypes: ["MID"] }
                    )
                );
            }*/
        };
        socket.onmessage = (evt) => {
            //upbit
            //console.log("upbit", evt);
            //if (type === "CONNECT_UPBIT_SOCKET") {
            const enc = new encoding.TextDecoder("utf-8");
            const data = JSON.parse(enc.decode(evt.data));
            emit(data);
            //} 
            /*else if (type === "CONNECT_BITHUMB_SOCKET") {
                emit(JSON.parse(evt.data));
            }*/
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
    //console.log(type);

    return eventChannel((eemit) => {
        var count = 0;
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
                /*if (count === 0) {
                    socket.send(
                        JSON.stringify(
                            { type: connectType, symbols: ["ETH_KRW"], tickTypes: ["MID"] }
                        )
                    );
                    count = 1;
                    console.log("0", data['content']);
                    eemit(data['content']);
                }
                else if (count === 1) {
                    socket.send(
                        JSON.stringify(
                            { type: connectType, symbols: ["BTC_KRW"], tickTypes: ["MID"] }
                        )
                    );
                    count = 0;
                    console.log("1", data['content']);
                    eemit(data['content']);
                }*/
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
        const bithumbTotalNames = Object.keys(state.Coin.bithumbTotalNames.data);

        var client;
        var bitclient;
        var clientChannel;
        //✅ new
        var bitclientChannel;


        client = yield call(createUpbitSocket);

        bitclient = yield call(createBithumbSocket);
        //console.log(upbitTotalNames);
        clientChannel = yield call(
            connectSocekt,
            client,
            connectType,
            type,
            upbitTotalNames,
            buffers.expanding(500)
        );

        //✅ new
        bitclientChannel = yield call(
            bitconnectSocekt,
            bitclient,
            connectType,
            type,
            bithumbTotalNames,
            buffers.expanding(500)
        );

        try {
            while (true) {
                const datas = yield flush(clientChannel); // 버퍼 데이터 가져오기
                const bitdatas = yield flush(bitclientChannel);

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
                        //console.log(sortedObj[data.code]);
                    });

                    sortedDATA = Object.keys(sortedObj).map(
                        (data) => sortedObj[data]
                    );
                    //yield put({ type: SUCCESS, payload: dataMaker(sortedDATA, state) });

                    if (bitdatas.length) {
                        var sortedObj = {};
                        var binanceObj;
                        var geckoObj;
                        //console.log(bitdatas);
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
                            //console.log(sortedObj[data.symbol]);
                            //console.log(sortedObj);
                        });
                        sortedData = Object.keys(sortedObj).map(
                            (data) => sortedObj[data]
                        );



                        binanceObj = yield call(binancecoinApi.getMarketCodes)
                        //geckoObj = yield call(geckoApi.getMarketCodes)

                        yield put({ type: SUCCESS, payload: coinReadDataUtils.mixExchangeUpdates(sortedDATA, sortedData, binanceObj.data, "", state) });
                        //yield put({ type: SUCCESS, payload: coinReadDataUtils.mixExchangeUpdates(sortedDATA, sortedData, binanceObj.data, geckoObj.data, state) });
                    }


                }
                yield delay(500); // 500ms 동안 대기

            }
        } catch (e) {
            console.log(e);
            yield put({ type: ERROR, payload: e });
        } finally {
            clientChannel.close();
        }
    };
};


const bitcreateConnectSocketSaga = (type, connectType, dataMaker) => {
    const SUCCESS = `${type}_SUCCESS`;
    const ERROR = `${type}_ERROR`;
    //console.log("11");

    return function* (action = {}) {

        //console.log("afsdf");
        /*var client;
        var clientChannel;
        if (type === "CONNECT_UPBIT_SOCKET")
            client = yield call(createUpbitSocket);
        else if (type === "CONNECT_BITHUMB_SOCKET")
            client = yield call(createBithumbSocket);

        clientChannel = yield call(
            bitconnectSocekt,
            client,
            connectType,
            type,
            action,
            buffers.expanding(500)
        );

        try {
            while (true) {
                const datas = yield flush(clientChannel); // 버퍼 데이터 가져오기
                const state = yield select();

                if (datas.length) {
                    const sortedObj = {};
                    datas.forEach((data) => {
                        if (type === "CONNECT_UPBIT_SOCKET") {
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
                        }
                        else if (type === "CONNECT_BITHUMB_SOCKET") {
                            console.log("check");
                            if (sortedObj[data.content]) {
                                sortedObj[data.content] =
                                    sortedObj[data.content].time > data.time
                                        ? sortedObj[data.content]
                                        : data;
                            } else {
                                sortedObj[data.content] = data;
                            }
                            sortedObj[data.content] = data;
                        }
                    });

                    const sortedData = Object.keys(sortedObj).map(
                        (data) => sortedObj[data]
                    );

                    yield put({ type: SUCCESS, payload: dataMaker(sortedData, state) });
                }

                yield delay(500); // 500ms 동안 대기
            }
        } catch (e) {
            yield put({ type: ERROR, payload: e });
        } finally {
            clientChannel.close();
        }*/
        //};
    }
};



export {
    createRequestSaga,
    requestActions,
    createConnectSocketSaga,
    createInitRequestSaga,
    bitcreateConnectSocketSaga
}