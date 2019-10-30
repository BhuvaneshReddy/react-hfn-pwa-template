// React core.
import React from 'react';
import { signOut, HfnFirebaseAuth, HfnAvatar } from '@heartfulnessinstitute/react-hfn-profile';

import { DefaultButton, FontIcon, Text } from 'office-ui-fabric-react';
import { XModal } from './XModal';

import useGlobal from "../store";

export const isSignedIn = () => {
    const [user] = useGlobal(
        state => state.user
    );

    return !!user && !!user.uid;
}

export const xUserEmail = () => {
    const [user] = useGlobal(
        state => state.user
    );

    return !!user && !!user.myInfo ? user.myInfo.user_email : "";
}

export const SignOut = (props) => {
    const [user, setUser] = useGlobal(
        state => state.user,
        actions => actions.setUser
    );

    function processSignOut() {
        signOut().then(() => setUser(null))
    }

    return (
        !!user && !!user.uid ? <DefaultButton text="Sign Out" onClick={processSignOut} /> : null
    )
}

export const EnsureLogin = (props) => {
    const [user, setUser] = useGlobal(
        state => state.user,
        actions => actions.setUser
    );

    function processLogout() {
        setUser(null)
    }

    function processLogin(loginBlob) {
        //console.log("processLogin", loginBlob);
        if (loginBlob && 'uid' in loginBlob && 'myInfo' in loginBlob && !!loginBlob.myInfo) {
            //console.log("processLogin set", loginBlob);
            setUser({ uid: loginBlob.uid, myInfo: loginBlob.myInfo })
        }
    }

    if (user && 'myInfo' in user &&  'user_email' in user.myInfo &&  !!user.myInfo.user_email) {
        return (props.children || null)
    }

    let modalParams = { isDarkOverlay: true, isBlocking: false }
    if ('withSignInButton' in props && props.withSignInButton) {
        modalParams.trigger = "Sign-In"
    }

    let containerFn = (c) => <XModal {...modalParams}>{c}</XModal>;

    return (
        <HfnFirebaseAuth
            containerFn={containerFn}
            doLogout={processLogout}
            doLogin={processLogin}
        />
    )
}

export const SignIn = () => {
    return (
        <EnsureLogin withSignInButton={true}>{null}</EnsureLogin>
    )
}

export const TheAvatar = (props) => {
    const [user, setUser] = useGlobal(
        state => state.user,
        actions => actions.setUser
    );
    
    function processLogout() {
        setUser(null)
    }

    if (!user) {
        return null
    } else {
        return (
            <HfnAvatar
                styleContainer={{ zIndex: "10000", fontSize: "18px", top: "10px", right: "10px", position: "absolute" }}
                floatRight
                afterSignOut={processLogout}
            />
        );
    }
}

export const TheHeader = (props) => (
    <React.Fragment>
        <div>
            <Text variant="large">
                {"backUrl" in props && <a href={props.backUrl}><FontIcon iconName={("backIcon" in props && props.backIcon) || "Back"} /></a>}
                {props.children}
            </Text>
        </div>
        <TheAvatar />
    </React.Fragment>
)