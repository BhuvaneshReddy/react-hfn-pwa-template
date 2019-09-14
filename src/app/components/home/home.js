import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Header, Grid, Tab } from 'semantic-ui-react';
import actions from '../../actions/actions';
import u from '../../libs/utils';

import 'semantic-ui-css/semantic.min.css';
import { EnsureLogin, SignOut } from '../../firebase/firebaseApp';
import Abhyasi from '../visitor/abhyasi/Abhyasi';
import NonAbhyasi from '../visitor/non-abhyasi/NonAbhyasi';
import Dashboard from '../visitor/dashboard/Dashboard';

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
    const panes = [
      {
        menuItem: 'Abhyasi',
        render: () => (
          <Tab.Pane>
            <Abhyasi />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Non Abhyasi',
        render: () => (
          <Tab.Pane>
            <NonAbhyasi />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Dashboard',
        render: () => (
          <Tab.Pane>
            <Dashboard />
          </Tab.Pane>
        )
      }
    ];
    return (
      <EnsureLogin>
        <div>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column>
                <Header as="h2">Visitor Management System</Header>
              </Grid.Column>

              <Grid.Column>
                <Grid columns={2}>
                  <Grid.Row>
                    <Grid.Column>
                      <Header>{this.props.userName}</Header>
                    </Grid.Column>
                    <Grid.Column>
                      <SignOut />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>

        <Tab panes={panes} />
      </EnsureLogin>
    );
  }
}

// <Button onClick={() => this.props.fetchProfileAPI('me', FRES)}>
//   Fetch Me
// </Button>;
