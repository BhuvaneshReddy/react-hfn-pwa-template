import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { Button } from 'semantic-ui-react';
import u from '../libs/utils';
import actions from '../actions/actions';
import { MyAuth } from './auth';

@connect(
    ({ localstorage: ls, globalstate: gs }) => ({
        loggedIn: u.loggedIn(ls),
        userName: u.userName(ls),
        loading: !u.isnotnull(ls)
    }),
    actions
)
export class SignIn extends React.Component {
    static propTypes = {
        loggedIn: PropTypes.bool,
    };
    componentWillUnmount() {
        this.props.signalExit();
    }
    render() {
        if (this.props.loading) {
            return "Loading...";
        }
 
        return (
            <div>
                <MyAuth
                    // onLogin={(loginBlob) => this.props.doLogin(loginBlob)}
                    // onLogout={() => this.props.doLogout() }
                />   
            </div>
        );
    }
}