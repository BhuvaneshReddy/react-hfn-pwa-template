import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import actions from '../../actions/actions';
import u from '../../libs/utils';

import 'semantic-ui-css/semantic.min.css';
import { EnsureLogin, SignOut } from '../../firebase/firebaseApp';

const FRES = 'fres';

export default @connect(
  ({ localstorage: ls, globalstate: gs }) => ({
    fres: u.getFetchResult(gs, FRES),
  }),
  actions)
class Home extends Component {
  render() {
    return (
      <div>
        <h1>PWA with MySRCM APIs - Boilerplate</h1>
        <div>
        </div>
        <br />
        <div></div>
        <Button href="#page1">RegServer fetch / set APIs demo</Button>
        <br />
        <br />
        <div></div>
        <Button href="#page2">ProfileServer APIs demo</Button>
        <br />
        <br />
        <div></div>
        <Button href="#/firestore-users">Firebase Cloudstore crud demo</Button>
        <br />
        <br />
        <Button href="#/comfort-dorm">Comfort Dorm</Button>
        <br />
        <br />
        <div>Signed-In Pages demo</div>
        <EnsureLogin withSignInButton={true}>

          <Button onClick={() => this.props.fetchProfile('me', {}, FRES)}>Fetch Me</Button>
          <br />

          <div> Fetch Me Output:
          {JSON.stringify(this.props.fres)}
          </div>
          <br/><br/>
          <div>
          </div>
          <SignOut />
        </EnsureLogin>

     </div>
    );
  }
}
