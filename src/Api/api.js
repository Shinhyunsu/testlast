import axios from "axios";
import { useSelector } from 'react-redux';
import CoinMarketData from "../Api/CoinMarketData.json";
import { call, put, select, flush, delay } from "redux-saga/effects";
import cors from 'cors';

export const kucoinApi = {
    getMarketCodes: () =>
        axios.get("https://api.kucoin.com/api/v1/symbols"),
    getMarketPriceCodes: () => {
        return axios.get(`https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH,BTC-ETH,BTC-LTC,BTC-XRP,BTC-ETC,BTC-OMG,BTC-CVC,BTC-DGB,BTC-SC,BTC-SNT,BTC-WAVES,BTC-NMR,BTC-XEM,BTC-QTUM,BTC-BAT,BTC-LSK,BTC-STEEM,BTC-DOGE,BTC-BNT,BTC-XLM,BTC-ARDR,BTC-ARK,BTC-STORJ,BTC-GRS,BTC-REP,BTC-RLC,USDT-BTC,USDT-ETH,USDT-LTC,USDT-XRP,USDT-ETC,KRW-NEO,KRW-MTL,KRW-LTC,KRW-XRP,KRW-ETC,KRW-OMG,KRW-SNT,KRW-WAVES,KRW-XEM,KRW-QTUM,KRW-LSK,KRW-STEEM,KRW-XLM,KRW-ARDR,KRW-ARK,KRW-STORJ,KRW-GRS,KRW-REP,KRW-ADA,BTC-ADA,BTC-MANA,USDT-OMG,KRW-SBD,BTC-SBD,KRW-POWR,BTC-POWR,KRW-BTG,USDT-ADA,BTC-DNT,BTC-ZRX,BTC-TRX,BTC-TUSD,BTC-LRC,KRW-ICX,KRW-EOS,USDT-TUSD,KRW-TRX,BTC-POLY,USDT-SC,USDT-TRX,KRW-SC,KRW-ONT,KRW-ZIL,KRW-POLY,KRW-ZRX,KRW-LOOM,BTC-BCH,USDT-BCH,KRW-BCH,BTC-MFT,BTC-LOOM,KRW-BAT,KRW-IOST,BTC-RFR,KRW-RFR,USDT-DGB,KRW-CVC,KRW-IQ,KRW-IOTA,BTC-RVN,BTC-GO,BTC-UPP,BTC-ENJ,KRW-MFT,KRW-ONG,KRW-GAS,BTC-MTL,KRW-UPP,KRW-ELF,USDT-DOGE,USDT-ZRX,USDT-RVN,USDT-BAT,KRW-KNC,BTC-MOC,BTC-ZIL,KRW-BSV,BTC-BSV,BTC-IOST,KRW-THETA,BTC-DENT,KRW-QKC,BTC-ELF,KRW-BTT,BTC-BTT,BTC-IOTX,BTC-SOLVE,BTC-NKN,BTC-META,KRW-MOC,BTC-ANKR,BTC-CRO,KRW-ENJ,KRW-TFUEL,KRW-MANA,KRW-ANKR,BTC-ORBS,BTC-AERGO,KRW-AERGO,KRW-ATOM,KRW-TT,KRW-CRE,BTC-ATOM,BTC-STPT,KRW-MBL,BTC-EOS,BTC-LUNA,BTC-DAI,BTC-MKR,BTC-BORA,KRW-WAXP,BTC-WAXP,KRW-HBAR,KRW-MED,BTC-MED,BTC-MLK,KRW-MLK,KRW-STPT,BTC-VET,KRW-ORBS,BTC-CHZ,KRW-VET,BTC-FX,BTC-OGN,KRW-CHZ,BTC-XTZ,BTC-HIVE,BTC-HBD,BTC-OBSR,BTC-DKA,KRW-STMX,BTC-STMX,BTC-AHT,BTC-PCI,KRW-DKA,BTC-LINK,KRW-HIVE,KRW-KAVA,BTC-KAVA,KRW-AHT,KRW-LINK,KRW-XTZ,KRW-BORA,BTC-JST,BTC-CHR,BTC-DAD,BTC-TON,KRW-JST,BTC-CTSI,BTC-DOT,KRW-CRO,BTC-COMP,BTC-SXP,BTC-HUNT,KRW-TON,BTC-ONIT,BTC-CRV,BTC-ALGO,BTC-RSR,KRW-SXP,BTC-OXT,BTC-PLA,KRW-HUNT,BTC-MARO,BTC-SAND,BTC-SUN,KRW-PLA,KRW-DOT,BTC-SRM,BTC-QTCON,BTC-MVL,KRW-SRM,KRW-MVL,BTC-GXC,BTC-AQT,BTC-AXS,BTC-STRAX,KRW-STRAX,KRW-AQT,BTC-GLM,KRW-GLM,BTC-FCT2,BTC-SSX,KRW-SSX,KRW-META,KRW-FCT2,BTC-FIL,BTC-UNI,BTC-BASIC,BTC-INJ,BTC-PROM,BTC-VAL,BTC-PSG,BTC-JUV,BTC-CBK,BTC-FOR,KRW-CBK,BTC-BFC,BTC-LINA,BTC-HUM,BTC-CELO,KRW-SAND,KRW-HUM,BTC-IQ,BTC-STX,KRW-DOGE,BTC-NEAR,BTC-AUCTION,BTC-DAWN,BTC-FLOW,BTC-STRK,KRW-STRK,BTC-PUNDIX,KRW-PUNDIX,KRW-FLOW,KRW-DAWN,KRW-AXS,KRW-STX,BTC-GRT,BTC-SNX,BTC-USDP,KRW-XEC,KRW-SOL,BTC-SOL,KRW-MATIC,BTC-MATIC,KRW-NU,BTC-NU`)
    }
};

export const upbitoinApi = {
    getMarketCodes: () =>
        axios.get("https://api.upbit.com/v1/market/all?isDetails=false"),
    getMarketPriceCodes: () => {
        return;
    }
};

export const binancecoinApi = {
    getMarketCodes: () =>
        axios.get("https://api1.binance.com/api/v3/ticker/price")
};


export const bithumbcoinApi = {
    getKRWMarketCodes: () =>
        axios.get("https://api.bithumb.com/public/ticker/ALL_KRW"),
    getBTCMarketCodes: () =>
        axios.get("https://api.bithumb.com/public/ticker/ALL_BTC")
};

