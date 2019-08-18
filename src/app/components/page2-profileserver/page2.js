import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Segment, Button, Dimmer, Loader } from 'semantic-ui-react';


import u from '../../libs/utils';

import actions from '../../actions/actions';
import { fetchProfileAPI } from '@heartfulnessinstitute/react-hfn-profile';
import { EnsureLogin } from '../../firebase/firebaseApp';


@connect(
    ({ localstorage: ls, globalstate: gs }) => ({
        loggedIn: u.loggedIn(ls),
        userName: u.userName(ls),
    }),
    actions
)
class Page2 extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({ is_create: true, data_orig: [], fetchme: null, loading: false })
    }

    render() {
        const headers = {};
        const params = {};
        return (
            <EnsureLogin>
                {this.state.loading && <Dimmer active={true}><Loader active={true} /></Dimmer>}
                <div>
                    Link: <a href="http://profile.srcm.net/apidocs">Profile API Docs</a>
                        <div><br /><br />
                            <Button content="Fetch Me"
                            onClick={() => {
                                this.setState({ loading: true });
                                    fetchProfileAPI('me')
                                        .then(res => res.results[0])
                                        .then(x => { this.setState({ loading: false, fetchme: JSON.stringify(x) }) })

                                }}
                            ></Button><br />
                            <Button content="Fetch Meditation Centers"
                            onClick={() => {
                                this.setState({ loading: true });
                                    fetchProfileAPI('meditation-centers')
                                        .then(x => { this.setState({ loading: false, fetchme: JSON.stringify(x) }) })

                                }}
                        ></Button><br />
                        <Button content="Fetch Centers"
                            onClick={() => {
                                this.setState({ loading: true });
                                fetchProfileAPI('groups')
                                    .then(x => { this.setState({ loading: false, fetchme: JSON.stringify(x) }) })

                            }}
                        ></Button><br />
                        </div>
                        <div>
                          
                            {this.state.fetchme && <div>  API Response:<br /> <b>{this.state.fetchme}</b></div>}
                        </div>
                    </div>
                
            </EnsureLogin>
        )
    }
}

class Page extends Component {
    render() {
        return (
            <div>
                <Segment color="blue">Page 2  </Segment>
                <Segment color="green">
                    <Page2 />
                </Segment>
            </div>
        );
    }
}

export default Page;
