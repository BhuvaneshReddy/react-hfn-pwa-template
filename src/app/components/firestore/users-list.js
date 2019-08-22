import React, { useState, useEffect } from 'react'

function useUsers(props) {
    console.log(props);
    const [ users, setUsers ] = useState([]);

    useEffect(() => {
        //const unsubscribe = props
        props.firestore_ref
        .where('creator', '==', props.email)
        .get()
        .then((snapshot) => {
            const newUsers = snapshot.docs.map((doc) => doc.data());
            console.log(newUsers);

            setUsers(newUsers);
        })

        //return () => unsubscribe();
    }, []);

    return users
}

const UsersList = (props) => {
    const users = useUsers(props);

    return(
        <div>
            <h4>Users List</h4>
            <table width="30%">
                <tr>
                    <th>Firstname</th>
                    <th>Creator</th>
                </tr>
                {users.map((user, index) => 
                    <tr key={index}>
                        <td>{user.firstname}</td>
                        <td>{user.creator}</td>
                    </tr>
                )}
            </table>
        </div>
    )
}

export default UsersList;