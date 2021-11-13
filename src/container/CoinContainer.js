import React from 'react';
import { useSelector } from 'react-redux';
import CoinList from '../components/CoinList';
import "../components/CoinList.css";
import CoinMarketData from "../Api/CoinMarketData.json";

function CoinContainer() {
    var coinTotal = useSelector((state) => state.Coin.marketNames);

    var TOPcoinTotalmain = useSelector((state) => state.Coin.TOPmarketNames);
    //console.log(TOPcoinTotalmain);
    // const TOPcoinTotal = Object.keys(TOPcoinTotalmain);

    const binanceUsdt = coinTotal.data['USDTKRW'];
    const BTCdata = coinTotal.data['BTC'];


    if (!TOPcoinTotalmain) return null;
    if (!binanceUsdt) return null;
    if (!coinTotal) return null;

    var test = TOPcoinTotalmain.filter((name, idx, arr) => {
        return arr.findIndex((item) => item.MainSym === name.MainSym) === idx
    })
    //console.log('test', test)

    //console.log('test', test)
    test.sort((next, prev) => {
        //console.log(next);
        if (parseFloat(next.per) > parseFloat(prev.per)) {
            return -1;
        }
        else
            return 0;
    });
    //console.log(TOPcoinTotalmain);
    //console.log(TOPcoinTotalmain['PNT'])
    /*
        var test = '';
        TOPcoinTotalmain.forEach((name) => {
            test += name.MainSym + " "
            //console.log(name)
    
        })*/

    //console.log('main', TOPcoinTotalmain);
    return (
        <div>
            <div className='coin-container'>
                <div className="coin-row" >
                    <img className="exchange-img" src={CoinMarketData[0].imgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {binanceUsdt.USDTsym}
                        </p>
                        <p className="coin-price">
                            {binanceUsdt.USDTKRWPrice}
                        </p>
                    </div>


                    <img className="exchange-img" src={CoinMarketData[0].imgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.upbitSym}
                        </p>
                        <p className="coin-price">
                            {BTCdata.upbitKRWPrice}
                        </p>
                    </div>

                    <img className="exchange-img" src={CoinMarketData[0].imgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.upbitUSDTSym}
                        </p>
                        <p className="coin-price">
                            {BTCdata.upbitUSDTPrice}
                        </p>
                    </div>


                    <img className="exchange-img" src={CoinMarketData[1].imgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.bithumbSym}
                        </p>
                        <p className="coin-price">
                            {BTCdata.bithumbPrice}
                        </p>
                    </div>


                    <img className="exchange-img" src={CoinMarketData[2].imgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.binanceUSDTSym}
                        </p>
                        <p className="coin-price">
                            {BTCdata.binanceUSDTPrice}
                        </p>
                    </div>
                    <img className="exchange-img" src={CoinMarketData[2].imgsrc} />
                    <div classame="coin-data">
                        <p className="coin-price">
                            {BTCdata.binanceBUSDSym}
                        </p>
                        <p className="coin-price">
                            {BTCdata.binanceBUSDPrice}
                        </p>
                    </div>
                </div>
            </div>

            {
                test.map((one_coin) => {
                    return <CoinList key={`coinlist_${one_coin.MainSym}`} one_coin={one_coin} one_coin_Sym={one_coin.MainSym} />;
                })
            }

        </div>
    )
}

export default CoinContainer;
/*



*/