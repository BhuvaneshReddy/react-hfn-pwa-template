import React, { useState, useEffect } from 'react'
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import DynamicTable from '@heartfulnessinstitute/react-hfn-forms/dist/DynamicTable';
import { firestoreCUD } from '../../app/libs/firestoreHelper';
import { xUserId } from '@heartfulnessinstitute/react-hfn-profile';
import strings from './strings.json';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Text, Panel } from 'office-ui-fabric-react';

const PRIMARY_KEY = "email";

const paneLayout = ((renderTable, renderNewButton, renderDynamicForm, showForm) => <React.Fragment>
    <Panel hasCloseButton={false}  isOpen={!!showForm}>
        {renderDynamicForm}
    </Panel>

    {renderNewButton}
    {renderTable}
</React.Fragment>);

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

const DeleteButton = <DefaultButton iconProps={{iconName: "Delete"}}>Delete</DefaultButton>;
const EditButton = <DefaultButton iconProps={{iconName: "Edit"}}>Edit</DefaultButton>;

const cols = [
    { name: PRIMARY_KEY, label: strings.usersdb[PRIMARY_KEY], col_props:{ maxWidth: 150 } },
    { name: "name", label: strings.usersdb.name, col_props: {  maxWidth: 150 } },
]

let formLayout = (renderField, renderErrors, renderLoading, renderSubmitBtn, renderDiscardBtn) => (
    <Stack>
        <Stack horizontal horizontalAlign="start">
            <span style={{ width: "300px" }}>{renderField(PRIMARY_KEY)}</span>
        </Stack>
        <Stack horizontal horizontalAlign="start">
            <span style={{ width: "300px" }}> {renderField('name')}</span>  
        </Stack>
        {renderErrors}
        {renderLoading}
        <div style={{height: "50px"}}></div>
        <Stack horizontal>
            {renderSubmitBtn} &nbsp;&nbsp; {renderDiscardBtn}
        </Stack>
    </Stack>
);

let formFields = [
    { name: PRIMARY_KEY, label: strings.usersdb[PRIMARY_KEY] }, 
    { name: "name", label: strings.usersdb.name }, 
]

const AdminsList = (props) => {
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
            data.added_by = xUserId();
        }
        firestoreCUD(props.firestore_collection, op, pk_key, pk_val, data, old_data, success_callback, failure_callback)
    };

    return (
        <React.Fragment>


        <DynamicTable
            primary_key={PRIMARY_KEY}
            table_columns={cols}
            data={users}
                allow={{ create: props.i_am_admin, delete: props.i_am_admin, update: props.i_am_admin }}
            buttons={{ deleteButton: DeleteButton, editButton: EditButton }}
            form_props={{ formFields, formLayout, formValidator }}
            onCUD={onCUD}
                list_props={{ compact: true }}
                paneLayout={paneLayout}
            />
        </React.Fragment>
    )
}

export default AdminsList;