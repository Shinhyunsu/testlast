import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import CoinContainer from "./container/CoinContainer";
import { startInit, getMarketNameSaga, startInitAsync } from './Reducer/coinReducer';
import "./App.css";
import { authService } from "fbase";
import AppRouter from "./Router";


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startInit());

  }, [dispatch]);

  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
      //console.log(user);
    });
  }, [])

  /*
<div className="coin-app">
      <CoinContainer />
    </div>
  */
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'Initializing....'}
      <footer>&copy; Ncrypto {new Date().getFullYear()} </footer>
    </>
  );
}

export default App;
