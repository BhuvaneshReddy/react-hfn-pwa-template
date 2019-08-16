import React, { Component } from "react";
import {
  Header,
  Button,
  Container,
  Grid,
  GridRow,
  GridColumn,
  Form,
  Segment,
  Label
} from "semantic-ui-react";

export default class Visitor extends Component {
  render() {
    return (
      <Segment>
        <Grid>
          <Grid.Column textAlign="center">
            <Header as="h2">Visitor Management System</Header>

            <Button.Group size="huge">
              <Button href="#/visitor/abhyasi">Abhyasi</Button>
              <Button.Or />
              <Button href="#/visitor/non-abhyasi">Non Abhyasi</Button>
            </Button.Group>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}
