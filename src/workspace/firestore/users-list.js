import React, { useState, useEffect } from 'react'
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import DynamicTable from '@heartfulnessinstitute/react-hfn-forms/dist/DynamicTable';
import { firestoreCUD } from './firestoreHelper';
import { xUserId } from '@heartfulnessinstitute/react-hfn-profile';

const PRIMARY_KEY = "userid";

function useUsers(props) {
    //console.log(props);
    const [ users, setUsers ] = useState([]);

    useEffect(() => {
        const unsubscribe = props
            .firestore_collection
            .onSnapshot((snapshot) => {
                const newUsers = snapshot.docs.map((doc) => ({  ...(doc.data()), [PRIMARY_KEY]: doc.id  }));
                setUsers(newUsers);
            })

        return () => unsubscribe();
    }, []);

    return users
}

const DeleteButton = <DefaultButton>Delete</DefaultButton>;
const EditButton = <DefaultButton>Edit</DefaultButton>;

const cols = [
    { name: PRIMARY_KEY, label: "Unique Id for User" },
    { name: "firstname", label: "Name" },
    { name: "lastname", label: "Last Name" },
    { name: "assigned", label: "Assigned" },
]

let formLayout = null;

let formFields = [
    { name: PRIMARY_KEY, label: "Unique Id for User" },
    { name: "firstname", label: "First Name" },
    { name: "lastname", label: "Last Name" },
];

const UsersList = (props) => {
    const users = useUsers(props);

    let formValidator = (new_data, old_data) => {
        // do this check for only create time
        if (!(PRIMARY_KEY in old_data)) {
            if (!!(users.find(r => r[PRIMARY_KEY] === new_data[PRIMARY_KEY]))) {
                return new_data[PRIMARY_KEY] + " already exists in the database"
            }
        }
        return false;
    };

    function onCUD(op, pk_key, pk_val, new_data, old_data, success_callback, failure_callback) {
        let data = {...new_data };
        if (op === 'create') {
            data.assigned = xUserId();
        }
        firestoreCUD(props.firestore_collection, op, pk_key, pk_val, data, old_data, success_callback, failure_callback)
    };

    return (

        <DynamicTable
            primary_key={PRIMARY_KEY}
            table_columns={cols}
            data={users}
            allow={{ create: true, delete: true, update: true }}
            buttons={{ deleteButton: DeleteButton, editButton: EditButton }}
            form_props={{ formFields, formLayout, formValidator }}
            onCUD={onCUD}
            list_props={{ compact: true }}
        />
    )
}

export default UsersList;