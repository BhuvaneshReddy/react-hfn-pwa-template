import React from 'react'

import UsersList from "./users-list";
import AddUser from "./add-user";

class Users extends React.Component {

    constructor(props) {
        super(props);
        console.log("==================================");
        console.log(this.props);
        console.log("==================================");
    }
    
    render() {

        return (
            <div>
                <h3>Users</h3>
                <br/>
                <UsersList firestore_ref={this.props.firestore_ref} />
                <br/>
                <hr />
                <AddUser firestore_ref={this.props.firestore_ref} />
                <br/>
                <hr />
                <br/><br/><br/>
            </div>
        )
    }
}

export default Users;