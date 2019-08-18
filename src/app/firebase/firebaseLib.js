// React core.
import React from 'react';

// Firebase.
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { BeatLoader } from 'react-spinners';


function readConfigFromEnv() {
        let firebaseConfig = null;
        let firebaseConfigDflt = null;
        let mysrcmConfig = null;
        try {
            firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_AUTH_CONFIG);
        } catch (e) {
            console.error("Error: REACT_APP_FIREBASE_AUTH_CONFIG not set properly")
        }
        try {
            firebaseConfigDflt = JSON.parse(process.env.REACT_APP_FIREBASE_DFLT_CONFIG);
        } catch (e) {
            console.warn("Note: REACT_APP_FIREBASE_DFLT_CONFIG not set properly")
        }
        try {
            mysrcmConfig = JSON.parse(process.env.REACT_APP_MYSRCM_CONFIG);
            const dummy1 = mysrcmConfig['profileServer']
            const dummy2 = mysrcmConfig['postmanToken'];
            const dummy3 = mysrcmConfig['xClientId'];
            if (!dummy1 || !dummy2 || !dummy3) {
                console.error("Error: REACT_APP_MYSRCM_CONFIG not set properly")
            }
        } catch (e) {
            console.error("Error: REACT_APP_MYSRCM_CONFIG not set properly")
        }

    return { firebaseConfig, firebaseConfigDflt, mysrcmConfig };
}

function readConfigFromDom() {
    const denv = document.getElementById('hfn-react-profile-data');
    if (isnotnull(denv)) {
        env = JSON.parse(decode1("X", denv.dataset.env));
        return env;
    } else {
        alert("Invalid ENV Configuration for Profile Login");
    }
    // XXX need to implement this fully
} 

const { firebaseConfig, firebaseConfigDflt, mysrcmConfig } = readConfigFromEnv();

// Instantiate a Firebase app.
const firebaseAppAuth = firebase.initializeApp(firebaseConfig, "auth");
export const firebaseApp = ((firebaseConfigDflt !== null) ?  firebase.initializeApp(firebaseConfigDflt) : null);

export const fetchProfileAPI = (api, method = "GET", extraHdrs = {}, extraData = {}) => {
    var _api = api;
    var _method = method;
    var _headers = extraHdrs;
    var _data = extraData;

    if (api === 'get-token') {
        _api = "/api/v2/secondary-firebase-token/";
        _method = "POST";
        _headers = {
            'Postman-Token': mysrcmConfig.postmanToken,
            'cache-control': 'no-cache',
        };
    } else if (api.startsWith('/api/v2/')) {
        _api = api;
    } else {
        _api = "/api/v2/" + api + "/";
    }
    const url = mysrcmConfig.profileServer + _api;

    return firebaseAppAuth.auth().currentUser.getIdToken().then(authToken => {

        var data = {
            method: _method,
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'x-client-id': mysrcmConfig.xClientId,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                ...(_headers),
            },
            ...(_data)
        };

        if (api === 'get-token') {
            return fetch(url, data).then(res => res.text())
        } else {
            return fetch(url, data).then(res => res.json())
        }
    });

}

export const fetchProfileMe = () => fetchProfileAPI("me").then(res => res.results[0]);


export class MyFirebaseAuth extends React.Component {
    uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult: () => this.processLogin(),
            signInFailure: (e) => alert(e)
        },
    };

    state = {
        loading: false,
        error: false,
    };

    processLogin = () => {
        const user = firebaseAppAuth.auth().currentUser;
        const setS = (d) => this.setState(d);

        const setLogin = this.props.doLogin;
        const setLogout = this.props.doLogout;
        // console.log("1st Auth Firebase Response", user);
        if (!!user) {
            const uid = user.uid;
            setS({ loading: true });

            console.log("Fetched 1st auth token");

            fetchProfileMe().then(myInfo => {
                // console.log("MySRCM Me Response", myInfo);
                console.log("MySRCM Me Response")
                setLogin({ uid, myInfo })
                setS({ loading: false });

            }).catch(e => {
                console.error("Error fetchProfileMe: ", e);
                setS({ loading: false, error: true })

            });

            if (firebaseApp !== null) {
                fetchProfileAPI("get-token").then(res => {
                    //     console.log("MySRCM Response", res);
                    firebaseApp.auth().signInWithCustomToken(res).then((r) => {
                        //        console.log("2nd Firebase Response", r);

                    }).catch(e => {
                        console.error("Error firebaseApp: ", e);
                        setS({ loading: false, error: true })
                    });;
                }).catch(e => {
                    console.error("Error fetchT: ", e);
                    setS({ loading: false, error: true })
                });

            } else {
                console.warn("Note: REACT_APP_FIREBASE_DFLT_CONFIG not set, firebase instance is not being setup");
            }

        } else {
            setLogout();
        }
    }

    /**
     * @inheritDoc
     */
    render() {

  

        return (
            <div style={{ minHeight: "300px" }}>
                {this.state.loading && <BeatLoader
                    loading={true}
                />}
                 <StyledFirebaseAuth
                    uiConfig={this.uiConfig}
                    firebaseAuth={firebaseAppAuth.auth()}
                />
                
                {this.state.error && <div>Error in Authentication</div>}
            </div>
        )
    }
}

export const myFirebaseAuthSignOut = () => firebaseAppAuth.auth().signOut();






