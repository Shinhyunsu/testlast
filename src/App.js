import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import CoinContainer from "./container/CoinContainer";
import { startInit, getMarketNameSaga, startInitAsync } from './Reducer/coinReducer';
import "./App.css";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(startInit());

  }, [dispatch]);

  return (
    <div className="coin-app">
      <CoinContainer />
    </div>
  );
}

export default App;
