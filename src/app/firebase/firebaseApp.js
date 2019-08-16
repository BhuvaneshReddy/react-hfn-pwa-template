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

const fetchT = () => fetchAPI("get-token");
const fetchMe = () => fetchAPI("me").then(res => res.results[0]);

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_AUTH_CONFIG);
const firebaseConfigDflt = JSON.parse(process.env.REACT_APP_FIREBASE_DFLT_CONFIG);

// Instantiate a Firebase app.
const firebaseApp = firebase.initializeApp(firebaseConfig, "auth");
export const firebaseAppDflt = firebase.initializeApp(firebaseConfigDflt);

export const fetchAPI = (api) => {
    return firebaseApp.auth().currentUser.getIdToken().then(authToken => {
        const apiMap = {
            "get-token": {
                api: "/api/v2/secondary-firebase-token/",
                method: "POST",
                extraHdrs: {
                    'Postman-Token': process.env.REACT_APP_MYSRCM_POSTMAN_TOKEN,
                    'cache-control': 'no-cache',
                }
            },
            "me": { api: "/api/v2/me/", method: "GET", extraHdrs: {} },
            "groups": { api: "/api/v2/groups/", method: "GET", extraHdrs: {} },
            "meditation-centers": { api: "/api/v2/meditation-centers/", method: "GET", extraHdrs: {} },
        }

        const url = process.env.REACT_APP_PROFILE_SERVER + apiMap[api].api;
        const method = apiMap[api].method;
        var data = {
            method,
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'x-client-id': process.env.REACT_APP_MYSRCM_FIREBASE_CLIENTID,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                ...(apiMap[api].extraHdrs),
            }
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
            signInSuccessWithAuthResult: () => false,
        },
    };

    state = {
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
            // console.log("1st Auth Firebase Response", user);
            if (!!user) {
                const uid = user.uid;
                user.getIdToken(false).then((idToken) => {
                  //  console.log(idToken);
                    console.log("Fetched 1st auth token");
                    setS({ loading: true });
                   
                   
                    fetchMe().then(myInfo => {
                        // console.log("MySRCM Me Response", myInfo);
                        console.log("MySRCM Me Response")
                        setLogin({ idToken, uid, myInfo })
                        setS({ loading: false });

                    }).catch(e => {
                        console.log("Error fetchMe: ", e);
                        setS({ loading: false, error: true })

                    });

                    fetchT().then(res => {
                   //     console.log("MySRCM Response", res);
                        firebaseAppDflt.auth().signInWithCustomToken(res).then((r) => {
                    //        console.log("2nd Firebase Response", r);
                            console.log("Fetched 2nd auth token");

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
        if (!this.props.isOpenLoginForm) {
            return null
        }

        return (
            <div>
                <Modal size="mini" open={this.props.isOpenLoginForm} closeIcon onClose={this.props.cancelLoginForm}>
                    <Modal.Header>Sign-In to Heartfulness Profile</Modal.Header>
                    {this.state.loading && <div><Dimmer active={true}><Loader active={true} /> </Dimmer></div>}
                    {!this.state.loading &&
                        <StyledFirebaseAuth
                            // className={styles.firebaseUi}
                            uiConfig={this.uiConfig}
                            firebaseAuth={firebaseApp.auth()} />
                    }
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
                firebaseApp.auth().signOut().then(() => setLogout())
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