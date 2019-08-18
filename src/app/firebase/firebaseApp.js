// React core.
import React from 'react';
import { connect } from 'react-redux';
import actions from '../actions/actions';
import u from '../libs/utils';

// Firebase.
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Button, Modal, Dimmer, Loader } from 'semantic-ui-react';

const fetchT = () => fetchProfileAPI("get-token");
const fetchMe = () => fetchProfileAPI("me").then(res => res.results[0]);

let firebaseConfig = null;
let firebaseConfigDflt = null;
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
// Instantiate a Firebase app.
const firebaseAppAuth = firebase.initializeApp(firebaseConfig, "auth");
export const firebaseApp = ((firebaseConfigDflt !== null) ?  firebase.initializeApp(firebaseConfigDflt) : null);

let mysrcmPostmanToken = null;
let mysrcmProfileServer = null;
let mysrcmClientId = null;
try {
    mysrcmPostmanToken = process.env.REACT_APP_MYSRCM_POSTMAN_TOKEN;
    mysrcmProfileServer = process.env.REACT_APP_PROFILE_SERVER;
    mysrcmClientId = process.env.REACT_APP_MYSRCM_FIREBASE_CLIENTID;
} catch (e) {
    console.error("Error: REACT_APP_MYSRCM_POSTMAN_TOKEN or REACT_APP_PROFILE_SERVER or REACT_APP_MYSRCM_FIREBASE_CLIENTID not set properly")
}


export const fetchProfileAPI = (api, method = "GET", extraHdrs = {}, extraData = {}) => {
    var _api = api;
    var _method = method;
    var _headers = extraHdrs;
    var _data = extraData;

    if (api === 'get-token') {
        _api = "/api/v2/secondary-firebase-token/";
        _method = "POST";
        _headers = {
            'Postman-Token': mysrcmPostmanToken,
            'cache-control': 'no-cache',
        };
    } else if (api.startsWith('/api/v2/')) {
        _api = api;
    } else {
        _api = "/api/v2/" + api + "/";
    }
    const url = mysrcmProfileServer + _api;

    return firebaseAppAuth.auth().currentUser.getIdToken().then(authToken => {

        var data = {
            method: _method,
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'x-client-id': mysrcmClientId,
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

@connect(
    ({ localstorage: ls, globalstate: gs }) => ({
        loggedIn: u.loggedIn(ls),
        userName: u.userName(ls),
        isOpenLoginForm: u.isOpenLoginForm(gs),
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
            signInSuccessWithAuthResult: () => this.processLogin(),
        },
    };

    state = {
        loading: false,
        error: false,
    };

    setS(d) {
        this.setState(d);
    }

    processLogin = () => {
        const user = firebaseAppAuth.auth().currentUser;
        const setS = this.setS;

        const setLogin = this.props.doLogin;
        const setLogout = this.props.doLogout;
        // console.log("1st Auth Firebase Response", user);
        if (!!user) {
            const uid = user.uid;
            setS({ loading: true });

            console.log("Fetched 1st auth token");

            fetchMe().then(myInfo => {
                // console.log("MySRCM Me Response", myInfo);
                console.log("MySRCM Me Response")
                setLogin({ uid, myInfo })
                setS({ loading: false });

            }).catch(e => {
                console.error("Error fetchMe: ", e);
                setS({ loading: false, error: true })

            });

            if (firebaseApp !== null) {
                fetchT().then(res => {
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
        if (!this.props.isOpenLoginForm) {
            return null
        }

        return (
            <div>
                <Modal size="mini" open={this.props.isOpenLoginForm} closeIcon onClose={this.props.cancelLoginForm}>
                    <Modal.Header>Sign-In to Heartfulness Profile</Modal.Header>
                    {this.state.loading && <div><Dimmer active={true}><Loader active={true} /> </Dimmer></div>}
                        <StyledFirebaseAuth
                            
                            // className={styles.firebaseUi}
                            uiConfig={this.uiConfig}
                            firebaseAuth={firebaseAppAuth.auth()} />
                    
                    {this.state.error && <div>Error in Authentication</div>}
                </Modal>

            </div>
        );
    }
}

@connect(
    ({ localstorage: ls, globalstate: gs }) => ({
        loggedIn: u.loggedIn(ls),
        userName: u.userName(ls),
        isOpenLoginForm: u.isOpenLoginForm(gs),
    }),
    actions
)
export class SignIn extends React.Component {

    render() {
        return (
            <div>
                {!this.props.loggedIn && 
                    <Button content="Sign In" onClick={() => {
                        this.props.setLoginForm({openLoginForm: true});
                    }} />
                }
            </div>
        );
    }
}

@connect(
    ({ localstorage: ls, globalstate: gs }) => ({
        loggedIn: u.loggedIn(ls),
        userName: u.userName(ls),
        isOpenLoginForm: u.isOpenLoginForm(gs),
    }),
    actions
)
export class SignOut extends React.Component {
    render() {
        const setLogout = this.props.doLogout;
        return (this.props.loggedIn && (!this.props.isOpenLoginForm) && <div>
            <Button content="Sign Out" onClick={() => {
                firebaseAppAuth.auth().signOut().then(() => setLogout())
            }} />
        </div>
        )
    }
}

@connect(
    ({ localstorage: ls }) => ({
        loggedIn: u.loggedIn(ls),
    }),
)
export class EnsureLogin extends React.Component {
    render() {
        if (this.props.loggedIn) {
            return (this.props.children)
        }
        return (
            <div>
                <MyAuth />
                <SignIn />
            </div>
        )
    }
} 