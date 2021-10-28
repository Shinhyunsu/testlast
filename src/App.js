import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import CoinContainer from "./container/CoinContainer";
import { startInit, getMarketNameSaga, startInitAsync } from './Reducer/coinReducer';
import "./App.css";
import { authService } from "fbase";
import AppRouter from "./Router";
import { doc, collection, addDoc, getFirestore, getDocs, updateDoc, setDoc } from "firebase/firestore"

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
          var logdBoolean = false;
          const ipData = await fetch('https://geolocation-db.com/json/');
          const locationIp = await ipData.json();
          const ipv4 = locationIp.IPv4;
          const db = await getFirestore();
          const querySnapshot = await getDocs(collection(db, "users"));
          let check = ""; let checkID = "";
          querySnapshot.forEach((docc) => {
            if (docc.data().useremail === user.email) {
              check = "emailOK";
              if (docc.data().ipaddress === ipv4) {
                check = "ipOK";
              }
              else if (docc.data().ipaddress === 'init') {
                check = "NEW";
                checkID = docc.id;
              } else {
                check = "FAIL";
              }
            }

          });

          if (check === 'ipOK')
            setIsLoggedIn(true);
          else if (check === 'NEW') {

            const washingtonRef = doc(db, "users", checkID);
            await updateDoc(washingtonRef, {
              ipaddress: ipv4
            });

          } else if (check === 'FAIL')
            setIsLoggedIn(false);

        }
        authCheck();

      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, [])

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'Initializing....'}
      <footer>&copy; Crypto {new Date().getFullYear()} </footer>
    </>
  );
}

export default App;
