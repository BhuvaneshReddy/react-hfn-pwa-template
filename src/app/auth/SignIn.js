import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { Button } from 'semantic-ui-react';
import LoginModal from '@heartfulnessinstitute/react-hfn-profile';
import u from '../libs/utils';
import actions from '../actions/actions';


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
        if (this.props.loggedIn) {
            return (
                    <Button onClick={() => this.props.doLogout()}>Sign-Out {this.props.userName}</Button>
            );
        }
        return (
            <div>
                <LoginModal
                    onLogin={(loginBlob) => this.props.doLogin(loginBlob)}
                    onLogout={() => this.props.doLogout() }
                />   
            </div>
        );
    }
}