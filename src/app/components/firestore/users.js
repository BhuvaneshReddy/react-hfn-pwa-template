import React from 'react'

import { firebaseApp } from '../../auth/auth';


import UsersList from "./users-list";
import AddUser from "./add-user";

const COLLECTION = 'JobApplications';

class Users extends React.Component {

    constructor(props) {
        super(props);
        console.log("==================================");
        console.log(this.props);
        console.log("==================================");
    }

    componentWillMount() {
        this.state({ firestore_ref: firebaseApp.firestore().collection(COLLECTION) })
    }
    
    render() {

        return (
            <div>
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

export default Users;