import React from 'react'
import { connect } from 'react-redux';
import actions from '../../actions/actions';
import u from '../../libs/utils';


import { firebaseAppDflt, MyAuth, SignIn } from '../../auth/auth';


import UsersList from "./users-list";
import AddUser from "./add-user";

const COLLECTION = 'JobApplications';

export default @connect(
    ({ localstorage: ls, globalstate: gs }) => ({
        loggedIn: u.loggedIn(ls),
        userName: u.userName(ls),
    }),
    actions)
class Users extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({ firestore_ref: firebaseAppDflt.firestore().collection(COLLECTION) })
    }
    
    render() {
        if (! this.props.loggedIn) {
            return <div><MyAuth/><Sign/></div>
        }

        return (
            <div>
                <MyAuth />
                {this.props.userName}
                <h3>Users</h3>
                <br/>
                <UsersList firestore_ref={this.state.firestore_ref} />
                <br/>
                <hr />
                <AddUser firestore_ref={this.state.firestore_ref} />
                <br/>
                <hr />
                <br/><br/><br/>
            </div>
        )
    }
}

