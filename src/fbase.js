// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const firebaseConfig = {
    /*apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,

    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MEESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID*/

    apiKey: "AIzaSyDNVLoQFHxWkZM5n_iHeSnz_ObKIklncl4",
    authDomain: "cryptoprice-9054d.firebaseapp.com",

    projectId: "cryptoprice-9054d",
    storageBucket: "cryptoprice-9054d.appspot.com",
    messagingSenderId: "540400785718",
    appId: "1:540400785718:web:b3b5004b9539823ab4bb97"
};

initializeApp(firebaseConfig);

export const authService = getAuth();
export const authGoogleProvider = GoogleAuthProvider;
export const authsignInWithPopup = signInWithPopup;


