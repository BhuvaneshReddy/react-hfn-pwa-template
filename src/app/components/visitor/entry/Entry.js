import React, { Component } from "react";
import { connect } from "react-redux";
import { Header, Button, Grid, Segment } from "semantic-ui-react";
import actions from "../../../actions/actions";
import u from "../../../libs/utils";
// import { MyAuth, SignIn } from "../../auth/auth";

@connect(
  ({ localstorage: ls, globalstate: gs }) => ({
    loggedIn: u.loggedIn(ls),
    userName: u.userName(ls)
  }),
  actions
)
export default class Entry extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  render() {
    // if (!this.props.loggedIn) {
    //   return (
    //     <div>
    //       <MyAuth />
    //       <SignIn />
    //     </div>
    //   );
    // }
    return (
      <div>
        <Segment>
          <Grid>
            <Grid.Column textAlign="center">
              <Header as="h2">Visitor Management System</Header>

              <Button.Group size="huge">
                <Button primary href="#/visitor/entry/abhyasi">
                  ABHYASI
                </Button>
                <Button.Or />
                <Button color="orange" href="#/visitor/entry/non-abhyasi">
                  NON ABHYASI
                </Button>
              </Button.Group>
            </Grid.Column>
          </Grid>
        </Segment>
      </div>
    );
  }
}
