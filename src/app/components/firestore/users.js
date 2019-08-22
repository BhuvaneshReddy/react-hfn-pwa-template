import React from 'react'


import {  EnsureLogin } from '../../firebase/firebaseApp';
import { firebaseApp } from '@heartfulnessinstitute/react-hfn-profile';


import UsersList from "./users-list";
import AddUser from "./add-user";

const COLLECTION = 'JobApplications';

export default class Users extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({ firestore_ref: firebaseApp.firestore().collection(COLLECTION), email: firebaseApp.auth().currentUser.email })
    }
    
    render() {
   

        return (
            <EnsureLogin>
                <h3>Users</h3>
                <br/>
                <UsersList firestore_ref={this.state.firestore_ref} creator={this.state.email} />
                <br/>
                <hr />
                <AddUser firestore_ref={this.state.firestore_ref} creator={this.state.email} />
                <br/>
                <hr />
                <br/><br/><br/>
            </EnsureLogin>
        )
    }
}

