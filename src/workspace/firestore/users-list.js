import React, { useState, useEffect } from 'react'
import { DefaultButton, ActionButton } from 'office-ui-fabric-react/lib/Button';
import DynamicTable from '@heartfulnessinstitute/react-hfn-forms/dist/DynamicTable';
import { firestoreCUD } from '../../app/libs/firestoreHelper';
import { xUserId } from '@heartfulnessinstitute/react-hfn-profile';
import strings from './strings.json';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import ActivitiesList from './user-activity';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { doFormatShortDate } from '@heartfulnessinstitute/react-hfn-forms/dist/formatting';

const PRIMARY_KEY = "userid";

const status_options = Object.entries(strings.status_opts).map(e => ({ name: e[0], label: e[1] }));

function useUsers(props) {
    //console.log(props);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = props
            .firestore_collection
            .onSnapshot((snapshot) => {
                const newUsers = snapshot.docs.map((doc) => ({ ...(doc.data()), [PRIMARY_KEY]: doc.id }));
                setUsers(newUsers);
            })

        return () => unsubscribe();
    }, []);

    return users
}

function useTrainers(props) {
    //console.log(props);
    if (props.scope !== 'admin') {
        return [];
    }

    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        const unsubscribe = props
            .trainers
            .onSnapshot((snapshot) => {
                const newTrainers = snapshot.docs.map((doc) => {
                    let r = doc.data();
                    return ({ name: r.email, label: r.name });
                });
                setTrainers(newTrainers);
            })

        return () => unsubscribe();
    }, []);

    return trainers
}

// const DeleteButton = <DefaultButton iconProps={{iconName: "Delete"}}>Delete</DefaultButton>;
// const EditButton = <DefaultButton iconProps={{iconName: "Edit"}}>Edit</DefaultButton>;


const paneLayout = ((renderTable, renderNewButton, renderDynamicForm, showForm) => <React.Fragment>
    <Panel hasCloseButton={false} isOpen={!!showForm}>
        {renderDynamicForm}
    </Panel>

    {renderNewButton}
    {renderTable}
</React.Fragment>);


let formLayout = (renderField, renderErrors, renderLoading, renderSubmitBtn, renderDiscardBtn) => (

    <Stack style={{ padding: "25px" }}>
        <Stack horizontal horizontalAlign="start">
            <span style={{ width: "300px" }}>{renderField(PRIMARY_KEY)}</span>

        </Stack>

        <Stack horizontal horizontalAlign="start">
            <span style={{ width: "300px" }}> {renderField('name')}</span>

        </Stack>
        <Stack horizontal horizontalAlign="start">

            <span style={{ width: "100px" }}>{renderField('age')}</span>
            <span style={{ width: "200px" }}>{renderField('gender')}</span>
        </Stack>
        <Stack horizontal horizontalAlign="start">
            <span style={{ width: "300px" }}>{renderField('city')}</span>
        </Stack>
        <Stack horizontal horizontalAlign="start">
            <span style={{ width: "150px" }}>{renderField('country')}</span>
            <span style={{ width: "150px" }}>{renderField('state')}</span>
        </Stack>
        <Stack horizontal horizontalAlign="start">
            <span style={{ width: "150px" }}>{renderField('mobile')}</span>
            <span style={{ width: "150px" }}> {renderField('phone2')}</span>

        </Stack>
        <Stack horizontal horizontalAlign="start">
            <span style={{ width: "300px" }}>{renderField('email')}</span>
        </Stack>
        <Stack horizontal horizontalAlign="start">
            <span style={{ width: "300px" }}>{renderField('status')}</span>
        </Stack>

        <Stack horizontal horizontalAlign="start">
            <span style={{ width: "300px" }}>{renderField('caretrainer')}</span>
        </Stack>
        {renderErrors}
        {renderLoading}
        <div style={{ height: "50px" }}></div>
        <Stack horizontal>
            {renderSubmitBtn} &nbsp;&nbsp; {renderDiscardBtn}
        </Stack>
    </Stack>

);





const UsersList = (props) => {
    const users = useUsers(props);
    const trainer_options = useTrainers(props);
    const i_am_admin = props.scope === 'admin';

    const [showSittings, setShowSittings] = useState(null);

    const getTrainerName = (x) => {
        const idx = trainer_options.findIndex(r => r.name === x);
        if (idx > -1) {
            return trainer_options[idx].label;
        } else {
            return x
        }
    }

    // const cols = [
    //     { name: PRIMARY_KEY, label: strings.usersdb[PRIMARY_KEY], col_props: { maxWidth: 150 } },
    //     { name: "name", label: strings.usersdb.name, col_props: { maxWidth: 150 } },
    //     { name: "age", label: strings.usersdb.age, col_props: { maxWidth: 60 } },
    //     { name: "gender", label: strings.usersdb.gender, transform: "gender", col_props: { maxWidth: 100 } },
    //     { name: "city", label: strings.usersdb.city, col_props: { maxWidth: 150 } },
    //     { name: "country", label: strings.usersdb.country, col_props: { maxWidth: 150 } },
    //     { name: "caretrainer", label: strings.usersdb.caretrainer, transform: trainer_options, col_props: { minWidth: 150 } },  
    //     { name: "status", label: strings.usersdb.status, transform: status_options,  col_props: { minWidth: 150 } },  
    // ]
    const cols = null;
    let formFields = [
        { name: PRIMARY_KEY, label: strings.usersdb[PRIMARY_KEY] },
        { name: "name", label: strings.usersdb.name, props: { disabled: !i_am_admin } },
        { name: "age", label: strings.usersdb.age, type: "age" },
        { name: "gender", label: strings.usersdb.gender, type: "gender" },
        { name: "city", label: strings.usersdb.city },
        { name: "country", label: strings.usersdb.country, type: "country" },
        { name: "state", label: strings.usersdb.state, type: "state" },
        { name: "email", label: strings.usersdb.email, type: "email", props: { required: false } },
        { name: "mobile", label: strings.usersdb.mobile, type: "phone" },
        { name: "phone2", label: strings.usersdb.phone2, type: "phone", props: { required: false } },
        { name: "caretrainer", label: strings.usersdb.caretrainer, type: "select", options: trainer_options },

        { name: "status", label: strings.usersdb.status, type: "select", options: status_options },
        { name: "activities", label: strings.usersdb.activities, props: { required: false } },

    ]

    let formValidator = (new_data, old_data) => {
        // do this check for only create time
        // console.log(new_data);
        if (!(PRIMARY_KEY in old_data)) {
            if (!!(users.find(r => r[PRIMARY_KEY] === new_data[PRIMARY_KEY]))) {
                return new_data[PRIMARY_KEY] + " already exists in the database"
            }
        }
        return false;
    };

    const fcs = props.fcs;

    function onCUD(op, pk_key, pk_val, new_data, old_data, success_callback, failure_callback) {
        let data = { ...new_data };
        let op1 = op;

        if (op === 'create') {
            data.assigned = xUserId();
        }
        if (op === 'delete') {
            data.deleted = true;
            op1 = 'update';
        }
        //console.log(fc.doc(pk_val));
        firestoreCUD(fcs, op1, pk_key, pk_val, data, old_data, success_callback, failure_callback)
    };

    function permanentlyDelete(item) {
        firestoreCUD(fcs, 'delete', PRIMARY_KEY, item[PRIMARY_KEY], {}, item, null, null)
    }

    function recoverDelete(item) {
        firestoreCUD(fcs, 'update', PRIMARY_KEY, item[PRIMARY_KEY], {deleted: false}, item, null, null)
    }

    function setActivities(user, pk_key, pk_val, op, c_pk_key, c_pk_val, new_data, old_data,
        success_callback, failure_callback) {
        //console.log(op, new_data, user);
        let activities = [...('activities' in user && user.activities ? user.activities : [])];
        //console.log(activities);

        if (op === 'create') {
            activities.push(new_data);
        } else {
            let idx = activities.findIndex(r => r[c_pk_key] === c_pk_val);
            if (idx > -1) {
                if (op === 'delete') {
                    activities.splice(idx, 1);
                } else if (op === 'update') {
                    activities[idx] = { ...old_data, ...new_data };
                }
            }
        }
        let new_user = { activities };
        //console.log(new_user, fc.doc);

        let refreshActivities = () => {
            setShowSittings({ ...user, ...new_user });
            success_callback();
        }

        firestoreCUD(fcs, "update", pk_key, pk_val, new_user, user, refreshActivities, failure_callback)
    };


    function _onClickShowSittings(item) {
        setShowSittings(item);
    }
    function _onResetShowSittings() {
        setShowSittings(null);
    }

    let RenderRecord = (item, idx, update_btn, delete_btn) => (
        <span key={idx} style={{
            marginLeft: "20px",
            fontFamily: '"Segoe UI", "Segoe UI Web(West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif',
        }}>
        <Stack horizontalAlign="space-between" horizontal>

   
                <Stack >
                    <span>
                        <div>{'deleted' in item && item.deleted && "DELETED RECORD"}</div>
                        <span style={{ fontSize: "1.2em" }}>
                            {item['name']}
                        </span>
           
                      &nbsp;&nbsp;  {item['city']}  {item['country']}
                    </span>

                    <div style={{ marginTop: "8px",  fontSize: "0.7em" }}>
                        <span style={{ backgroundColor: "blue",marginRight:"10px", padding: "2px 5px", color: "white" }}>
                        {('activities' in item && item.activities ? (""
                            + doFormatShortDate(item.activities[item.activities.length - 1].date)
                            + "  "
                            + item.activities[item.activities.length - 1].sitting) : strings.misc.not_started)}
                        </span>

                        <span style={{marginRight:"10px"}}>
                            {strings.status_opts[item['status']]}

                        </span>

                        <i> &nbsp;&nbsp;&nbsp;{item['gender']} {item['age']} </i>

                    </div>
                    <ActionButton onClick={() => _onClickShowSittings(item)}>show sittings</ActionButton>
         
            
                </Stack>

         

                <Stack>
                    <Stack horizontal horizontalAlign="start">
                        {!('deleted' in item && item.deleted) && update_btn}
                        {!('deleted' in item && item.deleted) && delete_btn}
                        {('deleted' in item && item.deleted) && <DefaultButton onClick={() => permanentlyDelete(item)}>permanently delete</DefaultButton>}
                        {('deleted' in item && item.deleted) && <DefaultButton onClick={() => recoverDelete(item)}>recover</DefaultButton>}


                    </Stack>
                    <Stack.Item>
                        {i_am_admin &&
                            <span style={{ color: "blue", fontSize: "0.8em" }}>
                                {strings.usersdb.caretrainer}:  {getTrainerName(item['caretrainer'])}
                            </span>
                        }
                    </Stack.Item>
               
                </Stack>
            </Stack>

            </span>


    )

    return (
        <React.Fragment>

            <DynamicTable key={"x" + trainer_options.length}
                primary_key={PRIMARY_KEY}
                table_columns={cols}
                data={users}
                allow={{ create: i_am_admin, delete: i_am_admin, update: i_am_admin }}
                form_props={{ formFields, formLayout, formValidator }}
                onCUD={onCUD}
                list_props={{ compact: true }}
                RenderRecord={RenderRecord}
                paneLayout={paneLayout}
            />
            {showSittings &&
                <Panel isOpen={showSittings !== null}
                    onDismiss={_onResetShowSittings}
                    type={PanelType.medium}
                >
                    <div style={{ fontSize: "1.2em" }}>{showSittings.name}</div>
                <ActivitiesList
                        user={showSittings}
                        pk_key={PRIMARY_KEY}
                        pk_val={showSittings[PRIMARY_KEY]}
                        activities={'activities' in showSittings && showSittings.activities ? showSittings.activities : []}
                        setActivities={setActivities}
                    />
                </Panel>
            }
        </React.Fragment>

    )
}

export default UsersList;