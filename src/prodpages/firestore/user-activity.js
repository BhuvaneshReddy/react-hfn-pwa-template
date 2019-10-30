import React from 'react'
import DynamicTable from '@heartfulnessinstitute/react-hfn-forms/dist/DynamicTable';
import strings from './strings.json';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

const PRIMARY_KEY = "date";

const sitting_options = Object.entries(strings.sitting_opts)
    .map(e => ({ name: e[0], label: e[1] }));

const cols = [
    {
        name: PRIMARY_KEY, label: strings.activity_db[PRIMARY_KEY],
        col_props: { maxWidth: 80 }, transform: "shortdate"
    },
    {
        name: "sitting", label: strings.activity_db.sitting,
        transform: sitting_options, col_props: { maxWidth: 60 }
    },
    {
        name: "notes",
        label: strings.activity_db.notes
    },
]


let formFields = [
    { name: PRIMARY_KEY, label: strings.activity_db[PRIMARY_KEY], type: "date" }, 
    { name: "sitting", label: strings.activity_db.sitting, type:"select", options: sitting_options }, 
    {
        name: "notes", label: strings.activity_db.notes,
        props: { multiline: true, required: false }
    },
]

const paneLayout = ((renderTable, renderNewButton, renderDynamicForm, showForm) => <React.Fragment>

    {showForm && renderDynamicForm}

    {!showForm &&  renderTable}
    {!showForm && renderNewButton}

</React.Fragment>);



const ActivitiesList = (props) => {
    const { activities, setActivities } = props;

    const onCUD = (op, pk_key, pk_val, new_data, old_data,
        success_callback, failure_callback) => {
 
        setActivities(props.user, props.pk_key, props.pk_val, op, pk_key, pk_val,
            new_data, old_data, success_callback, failure_callback);
    };


    
    return (
        <React.Fragment>
            <DynamicTable
                primary_key={PRIMARY_KEY}
                table_columns={cols}
                data={activities || []}
                allow={{ create: true, delete: true, update: true }}
                buttons={{ createButton: <DefaultButton iconProps={{iconName:"Add"}} text="Add Sitting" /> }}
                form_props={{ formTitle: "New Sitting", formFields,  formValidator: null }}
                onCUD={onCUD}
                list_props={{ compact: true, isHeaderVisible: true }}
                paneLayout={paneLayout}
            />
        </React.Fragment>
    )
}

export default ActivitiesList;