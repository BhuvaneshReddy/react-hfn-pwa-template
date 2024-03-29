import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import actions from '../../actions/actions';
import u from '../../libs/utils';

import 'semantic-ui-css/semantic.min.css';

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
        <h1>Registrations S</h1>
        <div>
        </div>
        <br />
        <div></div>
        <Button href="#page1">RegServer fetch / set APIs demo</Button>
        <br />
        <br />
        <div></div>
        <br />
        <br />
        <div></div>
        <Button href="#/firestore-users">Firebase Cloudstore crud demo</Button>
        <br />
        <br />
        <br />
        <br />
 

     </div>
    );
  }
}
