import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import actions from '../../actions/actions';
import u from '../../libs/utils';

import 'semantic-ui-css/semantic.min.css';
import { MyAuth, SignOut, SignIn, firestore_ref } from '../../auth/auth';

import Users from "./../firestore/users";

const FRES = 'fres';

export default @connect(
  ({ localstorage: ls, globalstate: gs }) => ({
    loggedIn: u.loggedIn(ls),
    userName: u.userName(ls),
    fres: u.getFetchResult(gs, FRES),
    gs: gs,
  }),
  actions)
class Home extends Component {
  render() {
    return (
      <div>
        <MyAuth/>
        <h1>PWA with MySRCM APIs - Boilerplate</h1>
        {this.props.userName}
        {this.props.loggedIn ? <SignOut /> : <SignIn/>}
        <div>
        </div>
        <br/>
        <Button href="#page1">Page 1</Button>
        <br />
        <br />
        <Button href="#page2">Page 2</Button>
        <br />
        <br />
        {this.props.loggedIn &&
          <Button onClick={() => this.props.fetchProfile('me', {}, FRES)}>Fetch Me</Button>
        }
        <br />
        <br />
        {/* {this.props.loggedIn &&
          <Users firestore_ref={firestore_ref}/>
        } */}
        <Users firestore_ref={firestore_ref}/>
        <div>
          {JSON.stringify(this.props.gs)}
        </div>
     </div>
    );
  }
}
