// React core.
import React from 'react';
import { connect } from 'react-redux';
import actions from '../actions/actions';
import u from '../libs/utils';

// Firebase.
import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const fetchAPI = (authToken, api) => {
    const apiMap = {
        "get-token": {
            api: "/api/v2/secondary-firebase-token/",
            method: "POST",
            extraHdrs: {
                'Postman-Token': '66edbbf3-9cfd-46bd-a253-b2ca97051574',
                'cache-control': 'no-cache',
            }
        },
        "me": { api: "/api/v2/me/", method: "GET", extraHdrs: {} },        
    }

    const url = "http://profile.srcm.net" + apiMap[api].api;
    const method = apiMap[api].method;
    var data = {
        method,
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'x-client-id': 'a3kR6ZGYQRrGJ5cCp4v2HgVeMK8sKcr6850LURoL',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            ...(apiMap[api].extraHdrs),
        }
    };

    return fetch(url, data);
}

const fetchT = (authToken) => fetchAPI(authToken, "get-token").then(res => res.text());
const fetchMe = (authToken) => fetchAPI(authToken, "me").then(res => res.json()).then(res => res.results[0]);


const firebaseConfig = {
    apiKey: "AIzaSyDvmxKH7738HE1T3fpJYUvi4BcEAakqQbQ",
    authDomain: "auth-qa.heartfulness.org",
    projectId: "unifiedplatform-qa",
    messagingSenderId: "498241637356",
    appId: "1:498241637356:web:c8cb5b2bfaf132d1"
};

const firebaseConfigDflt = {
    apiKey: "AIzaSyBbrfwnFLUSM_S3UfRsHWC4auNuiuVXLBk",
    authDomain: "pwa-hfn-dev.firebaseapp.com",
    databaseURL: "https://pwa-hfn-dev.firebaseio.com",
    projectId: "pwa-hfn-dev",
    storageBucket: "pwa-hfn-dev.appspot.com",
    messagingSenderId: "1008983810384",
    appId: "1:1008983810384:web:97d6d442596cb08f"
};

// Instantiate a Firebase app.
const firebaseApp = firebase.initializeApp(firebaseConfig, "auth");
const firebaseAppDflt = firebase.initializeApp(firebaseConfigDflt);

// function jwtToJson(token) {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const buff = new Buffer(base64, 'base64');
//     const payloadinit = buff.toString('ascii');
//     const payload = JSON.parse(payloadinit);
//     return payload;
// }

/**
 * The Splash Page containing the login UI.
 */

@connect(
    ({ localstorage: ls, globalstate: gs }) => ({
        loggedIn: u.loggedIn(ls),
        userName: u.userName(ls),
    }),
    actions
)
export class MyAuth extends React.Component {
    constructor(props) {
        super(props);
        this.setS = this.setS.bind(this);
    }
    uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult: () => false,
        },
    };

    state = {
        isSignedIn: undefined,

        loading: false,
        error: false,
    };

    setS(d) {
        this.setState(d);
    }

    /**
     * @inheritDoc
     */
    componentWillMount() {
        const setS = this.setS;

        const setLogin = this.props.doLogin;
        const setLogout = this.props.doLogout;

        this.unregisterAuthObserver = firebaseApp.auth().onAuthStateChanged((user) => {
            console.log("1st Auth Firebase Response", user);
            if (!!user) {
                user.getIdToken(false).then(function (idToken) {
                    console.log(idToken);
                    setS({ loading: true });

        

                    fetchT(idToken).then(res => {
                        console.log("MySRCM Response", res);
                        firebaseAppDflt.auth().signInWithCustomToken(res).then((r) => {
                            console.log("2nd Firebase Response", r);
                            
                            fetchMe(idToken).then(myInfo => {
                                console.log("MySRCM Me Response", myInfo);
                                setLogin({ loginState: { state: true }, myInfo })
                                setS({ loading: false, isSignedIn: true });

                            }).catch(e => {
                                console.log("Error fetchMe: ", e);
                                setS({ loading: false, error: true })

                            });
                        }).catch(e => {
                            console.log("Error firebaseAppDflt: ", e);
                            setS({ loading: false, error: true })
                        });;
                    }).catch(e => {
                        console.log("Error fetchT: ", e);
                        setS({ loading: false, error: true })
                    });

                }).catch(function (error) {
                    // Handle error
                    console.log("Error getIdToken: ", error);
                    setS({ loading: false, error: true })
                });
            } else {
                setLogout();
            }
        });
    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    /**
     * @inheritDoc
     */
    render() {

        const authuser = firebaseApp.auth().currentUser;
        const dfltuser = firebaseAppDflt.auth().currentUser;

        if (this.state.loading) {
            return <div>loading...</div>;
        }

        if (this.state.error) {
            return <div>Error...</div>;

        }

        return (
            <div >
                {! this.props.loggedIn &&
                    <div>
                        <StyledFirebaseAuth
                            // className={styles.firebaseUi}
                            uiConfig={this.uiConfig}
                            firebaseAuth={firebaseApp.auth()} />
                    </div>
                }
                {this.props.loggedIn &&
                    <div>
                        Hello {firebaseApp.auth().currentUser.displayName}. You are now signed In!
                        <button onClick={() => firebaseApp.auth().signOut()}>Sign-out</button>
                        <br />
                        <br />
                        <br />
                        <br />
                    {Object.entries(authuser).map(e => {

                        return <div><br/>{e[0]} : {e[1] !== null && typeof e[1] === 'string'? (e[1].length < 100 ?  e[1] : "big string" ): "object"}</div>
                    })}
                    <br /><br /><br />
                    {Object.entries(dfltuser).map(e => {
                        return <div>{e[0]} : {e[1] !== null && typeof e[1] === 'string' ? (e[1].length < 100 ? e[1] : "big string") :  "object"}</div>
                    })}
                    </div>
                }
            </div>
        );
    }
}

