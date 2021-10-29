import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import CoinContainer from "./container/CoinContainer";
import { startInit } from './Reducer/coinReducer';
import "./App.css";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startInit());

  }, [dispatch]);

  return (
    <CoinContainer />
  );
}
/*

<>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'Initializing....'}
      <footer>&copy; Crypto {new Date().getFullYear()} </footer>
    </>

*/
export default App;
