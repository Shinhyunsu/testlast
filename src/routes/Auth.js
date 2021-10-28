import React from "react";
import { authService, authGoogleProvider, authsignInWithPopup } from "fbase";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore"
import './Auth.css';


const Auth = () => {
    const onSocialClick = async (event) => {
        const ipData = await fetch('https://geolocation-db.com/json/');
        const locationIp = await ipData.json();
        const ipv4 = locationIp.IPv4;


        const {
            target: { name },
        } = event;
        let provider;
        if (name === 'Crypto total Price') {
            provider = new authGoogleProvider();
        }
        const data = await authsignInWithPopup(authService, provider);
        let email = "";
        if (data) {
            email = data.user.email;
        }
    }


    return (
        <div className="authStyle">
            <button className="authButton" onClick={onSocialClick} name='Crypto total Price'>
                Crypto total Price
           </button>
        </div>
    )
}
export default Auth;