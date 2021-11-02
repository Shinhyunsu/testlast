import { takeEvery, select, } from "redux-saga/effects";
import { upbitoinApi, bithumbcoinApi, binancecoinApi } from "../Api/api";
import { createConnectSocketSaga, createRequestSaga, requestActions, createInitRequestSaga } from '../Lib/asyncUtil';
import { coinListDataUtils, coinReadDataUtils } from '../Lib/utils';

const START_INIT = "START_INIT";
const START_INIT_ASYNC = "START_INIT_ASYNC";

const GET_UPBIT_MARKET_NAMES = "GET_UPBIT_MARKET_NAMES";
const GET_UPBIT_MARKET_NAMES_SUCCESS = "GET_UPBIT_MARKET_NAMES_SUCCESS";
const GET_UPBIT_MARKET_NAMES_ERROR = "GET_UPBIT_MARKET_NAMES_ERROR";

const GET_UPBIT_MARKET_PRICE_INIT = "GET_UPBIT_MARKET_PRICE_INIT";
const GET_UPBIT_MARKET_PRICE_INIT_SUCCESS = "GET_UPBIT_MARKET_PRICE_INIT_SUCCESS";
const GET_UPBIT_MARKET_PRICE_INIT_ERROR = "GET_UPBIT_MARKET_PRICE_INIT_ERROR";

const GET_BITHUMB_MARKET_KRW_NAMES = "GET_BITHUMB_MARKET_KRW_NAMES";
const GET_BITHUMB_MARKET_KRW_NAMES_SUCCESS = "GET_BITHUMB_MARKET_KRW_NAMES_SUCCESS";
const GET_BITHUMB_MARKET_KRW_NAMES_ERROR = "GET_BITHUMB_MARKET_KRW_NAMES_ERROR";

const GET_BITHUMB_MARKET_BTC_NAMES = "GET_BITHUMB_MARKET_BTC_NAMES";
const GET_BITHUMB_MARKET_BTC_NAMES_SUCCESS = "GET_BITHUMB_MARKET_BTC_NAMES_SUCCESS";
const GET_BITHUMB_MARKET_BTC_NAMES_ERROR = "GET_BITHUMB_MARKET_BTC_NAMES_ERROR";

const CONNECT_UPBIT_SOCKET = "CONNECT_UPBIT_SOCKET";
const CONNECT_UPBIT_SOCKET_SUCCESS = "CONNECT_UPBIT_SOCKET_SUCCESS";
const CONNECT_UPBIT_SOCKET_ERROR = "CONNECT_UPBIT_SOCKET_ERROR";

const CREATE_UPBIT_INIT = "CREATE_UPBIT_INIT";
const CREATE_UPBIT_INIT_SUCCESS = "CREATE_UPBIT_INIT_SUCCESS";
const CREATE_UPBIT_INIT_ERROR = "CREATE_UPBIT_INIT_ERROR";

const CREATE_BITHUMB_INIT = "CREATE_BITHUMB_INIT";
const CREATE_BITHUMB_INIT_SUCCESS = "CREATE_BITHUMB_INIT_SUCCESS";
const CREATE_BITHUMB_INIT_ERROR = "CREATE_BITHUMB_INIT_ERROR";

const GET_BINANCE_MARKET_NAMES = "GET_BINANCE_MARKET_NAMES";
const GET_BINANCE_MARKET_NAMES_SUCCESS = "GET_BINANCE_MARKET_NAMES_SUCCESS";
const GET_BINANCE_MARKET_NAMES_ERROR = "GET_BINANCE_MARKET_NAMES_ERROR";


const startInitAsync = () => ({ type: START_INIT_ASYNC });
const startInit = () => ({ type: START_INIT });

const getBinanceMarketNameSaga = createRequestSaga(
    GET_BINANCE_MARKET_NAMES,
    binancecoinApi.getMarketCodes,
    coinListDataUtils.binanceNames
);

const getUpbitMarketPriceInitSaga = createRequestSaga(
    GET_UPBIT_MARKET_PRICE_INIT,
    upbitoinApi.getMarketPriceCodes,
    coinListDataUtils.upbitPriceNames
);
const getUpbitAllMarketNameSaga = createRequestSaga(
    GET_UPBIT_MARKET_NAMES,
    upbitoinApi.getMarketCodes,
    coinListDataUtils.upbitAllNames
);
const getBithumbKRWMarketNameSaga = createRequestSaga(
    GET_BITHUMB_MARKET_KRW_NAMES,
    bithumbcoinApi.getKRWMarketCodes,
    coinListDataUtils.bithumbKRWNames
);
const getBithumbBTCMarketNameSaga = createRequestSaga(
    GET_BITHUMB_MARKET_BTC_NAMES,
    bithumbcoinApi.getBTCMarketCodes,
    coinListDataUtils.bithumbBTCNames
);



//✅ 업비트 소켓 연결
const connectUpbitSocketSaga = createConnectSocketSaga(
    CONNECT_UPBIT_SOCKET,
    "ticker",
    coinReadDataUtils.upbitUpdates
);

const createUpbitInitSocketSaga = createInitRequestSaga(
    CREATE_UPBIT_INIT,
    coinReadDataUtils.upbitInitNames
);

const createBithumbInitSocketSaga = createInitRequestSaga(
    CREATE_BITHUMB_INIT,
    coinReadDataUtils.bithumbInitNames
);


function* startInitSaga() {
    yield getUpbitAllMarketNameSaga();
    yield getUpbitMarketPriceInitSaga();

    yield getBithumbKRWMarketNameSaga();
    yield getBithumbBTCMarketNameSaga();

    yield getBinanceMarketNameSaga();
    const state = yield select();
    //const upbitmarketNames = Object.keys(state.Coin.upbitTotalNames.data);
    const upbitmarketNames = state.Coin.upbitTotalNames.data;
    yield createUpbitInitSocketSaga({ payload: upbitmarketNames });

    const bithumbmarketNames = state.Coin.bithumbTotalNames.data;
    yield createBithumbInitSocketSaga({ payload: bithumbmarketNames });

    const marketNames = Object.keys(state.Coin.upbitTotalNames.data);
    yield connectUpbitSocketSaga({ payload: marketNames });
}
function* coinSaga() {
    yield takeEvery(START_INIT, startInitSaga);
}

const initialState = {
    upbitTotalNames: {
        data: {
            "KRW-BTC": ""
        },
    },
    bithumbTotalNames: {
        data: {
            "BTC_KRW": ""
        },
    },
    binanceTotalNames: {
        data: {
            "ETHBTC": ""
        }
    },
    marketNames: {
        error: false,
        data: {
            "BTC": {
                imgsrc: "",
                gecko: "",
                upbitSym: "", upbitPrice: "",
                upbitBTC: "", upbitBTCPrice: "",
                upbitUSDT: "", upbitUSDTPrice: "",
                bithumbSym: "", bithumbPrice: "",
                bithumbBTC: "", bithumbBTCPrice: "",
                binanBTCSym: "", binanBTCPrice: "",
                binanUSDTSym: "", binanUSDTPrice: "",
                binanBNBSym: "", binanBNBPrice: "",

                calKoupbitBTC: "",
                calKobithumbBTC: "",
                calKobinanBTC: "",
                calKoupbitUSDT: "",
                calKoUSDT: "",
                calKoBUSD: ""
            },
        },
    },
    TOPmarketString: "",
    TOPmarketNames: [],
};

const coinReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_BINANCE_MARKET_NAMES_SUCCESS:
        case GET_BINANCE_MARKET_NAMES_ERROR:
            return requestActions(GET_BINANCE_MARKET_NAMES, "binanceTotalNames")(state, action);

        case GET_UPBIT_MARKET_NAMES_SUCCESS:
        case GET_UPBIT_MARKET_NAMES_ERROR:
            return requestActions(GET_UPBIT_MARKET_NAMES, "upbitTotalNames")(state, action);

        case GET_UPBIT_MARKET_PRICE_INIT_SUCCESS:
        case GET_UPBIT_MARKET_PRICE_INIT_ERROR:
            return requestActions(GET_UPBIT_MARKET_PRICE_INIT, "upbitTotalNames")(state, action);

        case GET_BITHUMB_MARKET_KRW_NAMES_SUCCESS:
        case GET_BITHUMB_MARKET_KRW_NAMES_ERROR:
            return requestActions(GET_BITHUMB_MARKET_KRW_NAMES, "bithumbTotalNames")(state, action);

        case GET_BITHUMB_MARKET_BTC_NAMES_SUCCESS:
        case GET_BITHUMB_MARKET_BTC_NAMES_ERROR:
            return requestActions(GET_BITHUMB_MARKET_BTC_NAMES, "bithumbTotalNames")(state, action);

        case CREATE_UPBIT_INIT_SUCCESS:
        case CREATE_UPBIT_INIT_ERROR:
            return requestActions(CREATE_UPBIT_INIT, "marketNames")(state, action);

        case CREATE_BITHUMB_INIT_SUCCESS:
        case CREATE_BITHUMB_INIT_ERROR:
            return requestActions(CREATE_BITHUMB_INIT, "marketNames")(state, action);

        case CONNECT_UPBIT_SOCKET_SUCCESS:
        case CONNECT_UPBIT_SOCKET_ERROR:
            return requestActions(CONNECT_UPBIT_SOCKET, "marketNames")(state, action);

        case START_INIT:
            return state;
        default:
            return state;
    }
}
export {
    coinReducer,
    coinSaga,
    startInit,
    connectUpbitSocketSaga,
    startInitAsync
}