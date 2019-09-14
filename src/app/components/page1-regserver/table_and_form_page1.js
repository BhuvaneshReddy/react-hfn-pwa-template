import React from 'react';
import { Segment, Button, Loader, Dimmer } from 'semantic-ui-react';
import DynamicTable from '@heartfulnessinstitute/react-hfn-forms/dist/DynamicTable';
import {
    getKanhaRegApi, postKanhaRegApiPk, postKanhaRegApi, postKanhaRegApiId,
    deleteKanhaRegApiId, deleteKanhaRegApiPk
} from '@heartfulnessinstitute/react-hfn-profile';
import u from '../../libs/utils';

const createButton = <Button>New Record</Button>;
const deleteButton = <Button>Delete</Button>;
const editButton = <Button>Edit</Button>;

const submitButton = <Button type="submit">Submit</Button>;
const discardButton = <Button>Discard</Button>;

class TableAndForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, data: []};
        this.onCUD = this.onCUD.bind(this)
    }

    componentWillMount() {
        this.loadInitial()
    }

    loadInitial() {
        let _api = "pages";
        let _params = { fields: "key,value" };

        this.setState({ loading: true });
        getKanhaRegApi(_api, _params).then(x => {
            this.setState({ data: x.results, loading: false })
        }).catch(e => {
            console.error(e);
            this.setState({ loading: false })
        })
    }

    onCUD(op, pk_key, pk_val, new_data = {}, old_data = {}, callback = () => { }) {
        if (op === 'delete') {
            //console.log(op, pk_key, pk_val);
            let X = (pk_key === 'id') ? deleteKanhaRegApiId : deleteKanhaRegApiPk;
            X("pages", pk_val).then(x => {
                if ('data' in x) {
                    this.setState({ data: this.state.data.filter(r => r[pk_key] !== pk_val) }, callback);
                }
            }).catch(e => console.error(e));
            return;
        }
        if (op === 'create' || op === 'update') {
            var to_update_data = { ...new_data };

            let X = (op === 'create') ? (pk_key === 'id' ? postKanhaRegApi : postKanhaRegApiPk) : (pk_key === 'id' ? postKanhaRegApiId : postKanhaRegApiPk);

            X("pages", pk_val, to_update_data)
                .then(x => {
                    let data;
                    if (op === 'create') {
                        data = Object.assign([], this.state.data);
                        data.push(x.results[0]);
                    } else {
                        data = u.findAndReplace(this.state.data, pk_key, pk_val, x.results[0]);
                    }
                    this.setState({ data },  callback);
                })
                .catch(e => {
                    console.error(e);
                })
        }
    }

    render() {
        const paneLayout = null;
        const renderRecord = null;
        const formLayout = null;

        const table_columns1 = [
            { name: 'id', label: 'ID' },
            { name: 'key', label: 'Key' },
            { name: 'value', label: 'Value' },
        ];
        const formFields = [
            { name: "key", label: "Key", type: "text" },
            { name: "value", label: "Value", type: "abhyasiid" },
        ];

        const formValidator = (vals, old_vals) => {
            if ('value' in vals && vals.value.startsWith('H')) {
                return "ERROR"
            }
            return false
        }
  
        return (
            <React.Fragment>
                {this.state.loading && <Dimmer active={true}><Loader /></Dimmer>}
                <Button floated="right" onClick={() => this.loadInitial()}>Refresh</Button>

                <DynamicTable
                    primary_key="key"
                    table_columns={table_columns1}
                    table_style={{ rTableCell: { padding: "10px" } }}
                    paneLayout={paneLayout}
                    renderRecord={renderRecord}
                    data={this.state.data}
                    allow={{ create: true, delete: true, update: true }}
                    buttons={{ createButton, deleteButton, editButton, submitButton, discardButton }}
                    form_props={{ formFields, formLayout, formValidator }}
                    onCUD={this.onCUD}
                    table_edit_inline={false}
                />
            </React.Fragment>
        )
    }
}

export default TableAndForm;
