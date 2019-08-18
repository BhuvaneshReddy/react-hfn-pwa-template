// React core.
import React from 'react';
import { connect } from 'react-redux';
import actions from '../actions/actions';
import u from '../libs/utils';

import { Button, Modal } from 'semantic-ui-react';
import { MyFirebaseAuth, myFirebaseAuthSignOut } from '@heartfulnessinstitute/react-hfn-profile';

@connect(
    ({ localstorage: ls, globalstate: gs }) => ({
        loggedIn: u.loggedIn(ls),
        userName: u.userName(ls),
        isOpenLoginForm: u.isOpenLoginForm(gs),
    }),
    actions
)
export class MyAuth extends React.Component {
    render() {
        if (!this.props.isOpenLoginForm) {
            return null
        }

        return (
            <div>
                <Modal size="mini" open={this.props.isOpenLoginForm} closeIcon onClose={this.props.cancelLoginForm}>
                    <Modal.Header>Sign-In to Heartfulness Profile</Modal.Header>
                    <MyFirebaseAuth 
                        doLogin={this.props.doLogin}
                        doLogout={this.props.doLogout}
                    />

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
                myFirebaseAuthSignOut().then(() => setLogout())

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