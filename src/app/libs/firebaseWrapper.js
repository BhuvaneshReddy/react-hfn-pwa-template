// React core.
import React from 'react';
import { connect } from 'react-redux';
import actions from '../actions/actions';
import u from './utils';
import { signOut, HfnFirebaseAuth, HfnAvatar } from '@heartfulnessinstitute/react-hfn-profile';

import { DefaultButton, FontIcon, Text } from 'office-ui-fabric-react';
import { XModal } from './XModal';

@connect(
    ({ localstorage: ls }) => ({
        loggedIn: u.loggedIn(ls),
    }),
    actions)
export class SignOut extends React.Component {
    
    constructor(props) {
        super(props);
        this.processSignOut = this.processSignOut.bind(this);
    }
    processSignOut() {
        signOut().then(() => this.props.doLogout())
    }
    render() {
        return (
            this.props.loggedIn ?  <DefaultButton text="Sign Out" onClick={this.processSignOut} /> : null
        )
    }
}


export class SignIn extends React.Component {
    render() {
        return (
            <EnsureLogin withSignInButton={true}>{null}
            </EnsureLogin>
        )
    }
}

@connect(
    ({ localstorage: ls }) => ({
        loggedIn: u.loggedIn(ls),
    }),
    actions)
export class EnsureLogin extends React.Component {
    constructor(props) {
        super(props);
        this.processLogout = this.processLogout.bind(this);
        this.processLogin = this.processLogin.bind(this);
    }

    processLogin(loginBlob) {
        if (loginBlob === undefined || loginBlob.uid === undefined) {
            return;
        }
        try {
            //console.log("loginBlob", loginBlob);
            this.props.doLogin(loginBlob)
        } catch (e) { }

    }
    processLogout() {
        try {
            this.props.doLogout()
        } catch (e) { }
    }
    render() {
        if (this.props.loggedIn) {
            return (this.props.children)
        }


        let modalParams = { isDarkOverlay: true, isBlocking: false }
        if ('withSignInButton' in this.props && this.props.withSignInButton) {
            modalParams.trigger = "Sign-In"
        }

        return (
            <XModal {...modalParams}>
                <div style={{height: "20px"}}></div>
                <HfnFirebaseAuth doLogout={this.processLogout} doLogin={this.processLogin} />
            </XModal>
        )
    }
} 


@connect(
    ({ localstorage: ls }) => ({
        loggedIn: u.loggedIn(ls),
    }),
    actions)
export class TheAvatar extends React.Component {
    render() {
        if (!this.props.loggedIn) {
            return null
        }
        return <HfnAvatar
            styleContainer={{ zIndex: "10000", fontSize: "18px", top: "10px", right: "10px", position: "absolute" }}
            floatRight afterSignOut={this.props.doLogout} />
    }
}

export const TheHeader = (props) => (
    <React.Fragment>

        <div>

            <Text variant="large">
                {"backUrl" in props && <a href={props.backUrl}><FontIcon iconName={("backIcon" in props && props.backIcon) || "Back" } /></a>}
                {props.children}
            </Text>

        </div>
        <TheAvatar />

    </React.Fragment>
    
)