import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Segment, Button, Header } from 'semantic-ui-react';

import { RecordsTableWithEditor, gender_options, indiastate_options, validatePhoneNumber } from '../../libs/forms';
import { fetchRecs, setRecsPBOneRun, fetchAggregates } from '../../libs/fetch';

import DynamicTable from '@heartfulnessinstitute/react-hfn-forms/dist/DynamicTable';

import u from '../../libs/utils';

import actions from '../../actions/actions';
import { EnsureLogin, TheHeader } from '../../firebase/firebaseApp';

@connect(
    ({ localstorage: ls, globalstate: gs }) => ({
        loggedIn: u.loggedIn(ls),
        userName: u.userName(ls),
    }),
    actions
)
class TableAndForm extends React.Component {
    constructor(props) {
        super(props);
        this.SaveOrDelete = this.SaveOrDelete.bind(this);
        this.onCUD = this.onCUD.bind(this)

    }

    componentWillMount() {
        this.setState({ loading: false, output: null, is_create: true, data_orig: [], data: [], fetchme: null })
        if (this.props.loggedIn) {
            this.reload()
        }
    }
    reload(setrec = null) {
        const run = {
            "m": "avr.pages",
            "f": ["id", "key", "value"],
            "c": [['id', '>', 0]],
        };

        var X = () => (setrec === null) ? fetchRecs(run) : setRecsPBOneRun([setrec], run);

        this.setState({ loading: true });
        X().then(rows => {
            console.log(rows);
            this.setState({ data_orig: rows, data: rows, loading: false });
        }).catch(e => { console.log(e); this.setState({ loading: false }) });
    }
    SaveOrDelete(action, recid, data = {}, data_orig = {}) {
        console.log(action, data);
        var to_update_data = { ...data };

        if (action === 'delete') {
            //to_update_data.deleted = 1;
            console.log("Delete not yet supported");
            return;
        }
        if (action === 'save') {

        }
        const setrec = {
            m: 'avr.pages',
            c: [['id', '=', recid]],
            v: to_update_data,
        };
        this.reload(setrec);
    }

    onCUD(op, pk_key, pk_val, new_data, old_data) {
        console.log(op, new_data);
        var to_update_data = { ...new_data };
        let setrec;
        if (op === 'delete') {
            //to_update_data.deleted = 1;
            console.log("Delete not yet supported");
            return;
        }
        if (op === 'create') {
            setrec = {
                m: 'avr.pages',
                c: [['id', '=', 0]],
                v: to_update_data,
            };
        }
        if (op === 'update') {
            setrec = {
                m: 'avr.pages',
                c: [[pk_key, '=', pk_val]],
                v: to_update_data,
            };
        }
 
        this.reload(setrec);
    }
    render() {
        const table_columns = [
            { header: 'Id', column: 'id' },
            { header: 'Key', column: 'key' },
            { header: 'Value', column: 'value' },
        ];

        const form_fields = [
            { name: "key", required: true, label: "Key", type: "text" },
            { name: "value", required: true, label: "Value", type: "text" },
        ]


        const table_columns1 = [
            { name: 'id', label: 'ID' },
            { name: 'key', label: 'Key' },
            { name: 'value', label: 'Value' },
        ];
        const paneLayout = null;
        const renderRecord = null;
        const formLayout = null;
        const formFields = [
            { name: "key", props: { required: true }, label: "Key", type: "text" },
            { name: "value", props: {required: true }, label: "Value", type: "text" },
        ]

        const createButton = <button>Create New Record</button>;
        const deleteButton = <button>Delete Rec</button>;
        const editButton = <button>Edit Record</button>;

        const submitButton = <button style={{ backgroundColor: "green" }} type="submit">Submit</button>;
        console.log(this.state.data);
        return (
            <EnsureLogin>

                    <DynamicTable
                        table_columns={table_columns1}
                        table_style={{ rTableCell: { padding: "10px" } }}
                        paneLayout={paneLayout}
                        renderRecord={renderRecord}
                        data={this.state.data}
                        allow={{ create: true, delete: true, update: true }}
                        buttons={{ createButton, deleteButton, editButton, submitButton }}
                        form_props={{ formFields, formLayout }}
                        onCUD={this.onCUD}
                        table_edit_inline={false}
                    />
                               
                                
                                 
                

                        
                
            </EnsureLogin>
        )
    }
}

class Page1 extends Component {
    componentWillMount() { 
        this.setState({ loading: false, output: null });
    }
    
    render() {
        const qrun = {
            "m": ["avr_pages"],
            "gf": ["key"],
            "cf": ['id'],
        };

        return (
            <div>
                <TheHeader>Page 1</TheHeader>
                <Segment color="green">
                    <TableAndForm />
                </Segment>
                <Segment color="olive">
                    <Button content="Aggregate Query"
                        onClick={() => {
                            this.setState({ loading: true });
                            fetchAggregates(qrun).then(output => this.setState({
                                loading: false,
                                output
                            }))
                        }}
                    />
                    {this.state.output && JSON.stringify(this.state.output)}
                </Segment>
            </div>
        );
    }
}

export default Page1;
