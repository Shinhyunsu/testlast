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
        var logdBoolean = Boolean;
        const authCheck = async () => {
          const ipData = await fetch('https://geolocation-db.com/json/');
          const locationIp = await ipData.json();
          const ipv4 = locationIp.IPv4;

          console.log("ipv4", ipv4);
          const db = await getFirestore();
          const querySnapshot = await getDocs(collection(db, "users"));

          querySnapshot.forEach((doc) => {
            //console.log("email", doc.data().useremail);
            //console.log("ip", doc.data().ipaddress);
            if (doc.data().useremail === user.email) {
              if (doc.data().ipaddress === ipv4) {
                console.log("already email but ok");
                logdBoolean = true;
                return;
              } else {
                console.log(" email error");
                //setIsLoggedIn(false);
                logdBoolean = false;
                return;
              }
            }
          });
        }

        authCheck();
        setIsLoggedIn(true);
        /*
        authCheck();
        console.log("123", logdBoolean);
        if (logdBoolean === true)
          setIsLoggedIn(true);
        else if (logdBoolean === false)
          setIsLoggedIn(false);*/

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
