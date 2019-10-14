import React, { Component } from 'react';

import { Segment, Button, Container, Grid } from 'semantic-ui-react';


import { EnsureLogin, TheHeader } from '../../app/libs/firebaseWrapper';
import TableAndForm from './table_and_form_page1';

class Page1 extends Component {
    componentWillMount() {
        this.setState({ loading: false, output: null });
    }

    render() {
 

        return (
            <div style={{backgroundColor: "black", height:"100vh", width:"100vw" }}>
                <TheHeader backUrl="https://heartfulness.org/kanha/kanha-inauguration">Heartfulness Celebrations</TheHeader>
                
                <Container style={{maxWidth: "450px"}}>
                    <EnsureLogin>

                    <Grid container doubling stackable columns={4}>
                        <Grid.Row>
                            <Grid.Column>
                                    <Segment>
                                        <TableAndForm />

                                    </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>1</Segment>
                                <Segment>2</Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>1</Segment>
                                <Segment>2</Segment>
                                <Segment>3</Segment>
                            </Grid.Column>
                        </Grid.Row>
                        
                        <Grid.Row >
                            <Grid.Column>

                            <Segment>1</Segment>
                                </Grid.Column>

                        </Grid.Row>
                        </Grid>

                    </EnsureLogin>
                </Container>
            </div>
        );
    }
}

export default Page1;
