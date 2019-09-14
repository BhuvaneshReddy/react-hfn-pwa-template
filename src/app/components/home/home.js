import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Header } from 'semantic-ui-react';
import actions from '../../actions/actions';
import u from '../../libs/utils';

import 'semantic-ui-css/semantic.min.css';
import { EnsureLogin, SignOut } from '../../firebase/firebaseApp';

const FRES = 'fres';

export default
@connect(
  ({ localstorage: ls, globalstate: gs }) => ({
    userName: u.userName(ls),
    fres: u.getFetchResult(gs, FRES)
  }),
  actions
)
class Home extends Component {
  render() {
    return (
      <div>
        <div>
          <Header as="h2">Visitor Management System</Header>
        </div>
        <EnsureLogin>
          <div>{'Logged In as ' + this.props.userName}</div>
          <SignOut />
        </EnsureLogin>
      </div>
    );
  }
}

// <Button onClick={() => this.props.fetchProfileAPI('me', FRES)}>
//   Fetch Me
// </Button>;
