import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchProfileAPI } from '@heartfulnessinstitute/react-hfn-profile';
import { Segment, Button } from 'semantic-ui-react';

import { RecordsTableWithEditor, gender_options, indiastate_options, validatePhoneNumber } from '../../libs/forms';
import { fetchRecs, setRecsPBOneRun } from '../../libs/fetch';
import { SignIn } from '../../auth/SignIn';

import u from '../../libs/utils';

import actions from '../../actions/actions';

@connect(
    ({ localstorage: ls, globalstate: gs }) => ({
        loggedIn: u.loggedIn(ls),
        userName: u.userName(ls),
        loginBlob: u.loginBlob(ls),
    }),
    actions
)
class TableAndForm extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({ is_create: true, data_orig: [],  fetchme: null })
    }

    render() {
        console.log(this.props.loggedIn, this.props.loginBlob);
   
        return (
            <div>
                {!this.props.loggedIn &&
                    <SignIn onLogin={(loginBlob) => this.props.doLogin(loginBlob)} />
                }
                {
                    this.props.loggedIn &&
                            <div>
                            
                                    <div><br /><br />
                                        <Button content="Fetch Me"
                                            onClick={() => {
                                                fetchProfileAPI(this.props.loginBlob, '/api/v2/me/')
                                                    .then(x => { this.setState({ fetchme: JSON.stringify(x) }) })

                                            }}
                                        ></Button><br />

                                    </div>
                                
                                <div>
                                    {this.state.fetchme && <div>FetchMe: <b>{this.state.fetchme}</b></div>}
                                </div>
                            </div>

                        
                }
            </div>
        )
    }
}

class Page1 extends Component {
    render() {
        return (
            <div>
                <Segment color="blue">Page 2  </Segment>
                <Segment color="green">
                    <TableAndForm />
                </Segment>
            </div>
        );
    }
}

export default Page1;
