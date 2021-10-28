import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import CoinContainer from "./container/CoinContainer";
import { startInit, getMarketNameSaga, startInitAsync } from './Reducer/coinReducer';
import "./App.css";
import { authService } from "fbase";
import AppRouter from "./Router";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore"

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startInit());

  }, [dispatch]);

  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(async () => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        const authCheck = async () => {
          const ipData = await fetch('https://geolocation-db.com/json/');
          const locationIp = await ipData.json();
          const ipv4 = locationIp.IPv4;


          const db = await getFirestore();
          const querySnapshot = await getDocs(collection(db, "users"));
          querySnapshot.forEach((doc) => {
            if (doc.data().useremail === user.email) {
              console.log("already email");
              if (doc.data().ipaddress === ipv4) {
                console.log("ok");
              } else {
                console.log("error!!!");
              }
            }

          });
        }
        authCheck();
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
