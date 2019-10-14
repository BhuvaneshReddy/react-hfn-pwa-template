import React, { Component } from 'react';

import { Segment, Button } from 'semantic-ui-react';

import { fetchAggregates } from '../../libs/fetch';

import { TheHeader } from '../../libs/firebaseWrapper';


class Page1 extends Component {
    componentWillMount() {
        this.setState({ loading: false, output: null });
    }

    render() {
        const qrun = {
            "m": ["avr_pages"],
            "gf": ["key"],
            "cf": ['id'],
        };

        return (
            <div>
                <TheHeader>Page 1</TheHeader>
      
                <Segment color="olive">
                    <Button content="Aggregate Query"
                        onClick={() => {
                            this.setState({ loading: true });
                            fetchAggregates(qrun).then(output => this.setState({
                                loading: false,
                                output
                            }))
                        }}
                    />
                    {this.state.output && JSON.stringify(this.state.output)}
                </Segment>
            </div>
        );
    }
}

export default Page1;
