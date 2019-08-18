import React from 'react'


import { firebaseApp, EnsureLogin } from '../../firebase/firebaseApp';


import UsersList from "./users-list";
import AddUser from "./add-user";

const COLLECTION = 'JobApplications';

export default class Users extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({ firestore_ref: firebaseApp.firestore().collection(COLLECTION) })
    }
    
    render() {
   

        return (
            <EnsureLogin>
                <h3>Users</h3>
                <br/>
                <UsersList firestore_ref={this.state.firestore_ref} />
                <br/>
                <hr />
                <AddUser firestore_ref={this.state.firestore_ref} />
                <br/>
                <hr />
                <br/><br/><br/>
            </EnsureLogin>
        )
    }
}

