import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Segment, Button, Table } from 'semantic-ui-react';

import { RecordsTableWithEditor, gender_options, indiastate_options, validatePhoneNumber } from '../../libs/forms';
import { fetchRecs, setRecsPBOneRun, fetchAggregates } from '../../libs/fetch';

import u from '../../libs/utils';

import actions from '../../actions/actions';
import { MyAuth, EnsureLogin } from '../../firebase/firebaseApp';

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
    }

    componentWillMount() {
        this.setState({ loading: false, output: null, is_create: true, data_orig: [], fetchme: null })
        if (this.props.loggedIn) {
            this.reload()
        }
    }
    reload(setrec = null) {
        const run = {
            "m": "avr.resource.reserve",
            "f": ["id", "l1", "l2", 'l3', 'tag', 'status', 'claim_key'],
            "c": [['id', '>', 0]],
        };

        var X = () => (setrec === null) ? fetchRecs(run) : setRecsPBOneRun([setrec], run);

        this.setState({ loading: true });
        X().then(rows => {
            console.log(rows);
            this.setState({ data_orig: rows, loading: false });
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
            m: 'avr.resource.reserve',
            c: [['id', '=', recid]],
            v: to_update_data,
        };
        this.reload(setrec);
    }
    render() {
        const table_columns = [
            { header: 'Group', column: 'l1' },
            { header: 'Room', column: 'l2' },
            { header: 'Bed', column: 'l3' },
            { header: 'Status', column: 'status' },
        ];

        const form_fields = [
            { name: "l1", required: true, label: "Group", type: "text" },
            { name: "l2", required: true, label: "Room", type: "text" },
            { name: "l3", required: true, label: "Bed", type: "text" },
            { name: "status", required: true, label: "Status", type: "text" },
        ]
        return (
            <EnsureLogin>
                    <div>
                        <div>
                            <RecordsTableWithEditor
                                items_header={"Room Beds"}
                                norecords_message="You have not yet created any bed yet"
                                table_columns={table_columns}
                                items={this.state.data_orig}
                                allow_edit={false}
                                allow_create={true}
                            allow_delete={false}    
                            newitem_header={"Add New Bed"}
                            edititem_header={"Edit Bed"}
                            newitem_button="Add New Bed"
                            newItemDefaults={{ status: "free" }}
                            form_fields={form_fields}
                            handleRecordAction={this.SaveOrDelete}
                            />
                    
                        </div>


                    </div>

                <Button onClick={this.reload}>Refresh</Button>

                
            </EnsureLogin>
        )
    }
}

class DormsPage extends Component {
    componentWillMount() {
        this.setState({ loading: false, output: null });
    }

    render() {
        const buttons = {
            freerooms: {
                "m": ["avr_resource_reserve"],
                "gf": ["l1", "l2"],
                "cf": ['id'],
                "c": [['status', '=', 'free']],
                "hr": ['Group', 'Room', "Free"]
            },
            bedstatus: {
                "m": ["avr_resource_reserve"],
                "f": ["l1", "l2", "l3", "status"],
                "c": [['claim_key', '=', 'xyz' ]],
                "hr": ['Group', 'Room', 'Bed', "Status"]
            }
        };

        const button_map = { freerooms: "Free Rooms", bedstatus: "Bed Status" };

        return (
            <div>
                <Segment color="blue">Page showing APIs for Dorm Booking  </Segment>
                <Segment color="green">
                    <TableAndForm />
                </Segment>
                <Segment color="olive">
                    {Object.entries(button_map).map(e => 
                    <Button key={e[0]} content={e[1]}
                        onClick={() => {
                            this.setState({ loading: true });
                            fetchAggregates(buttons[e[0]]).then(output => this.setState({
                                loading: false,
                                output
                            }))
                        }}
                    />)
                    }
                    {this.state.output &&
                        <div>

                            <Table>
                                <thead><tr>
                                {this.state.output.header.map((x,y) => <td key={y}>{x}</td>)}
                            </tr></thead>

                            <tbody>
                                {
                                    this.state.output.rows.map((row, ridx) => <tr key={ridx}> {
                                        row.map((cell, cidx) => <td key={cidx}>{cell}</td>)

                                    } </tr>)
                                }
                            </tbody>

                            </Table>
                        </div>
                    }
                </Segment>
            </div>
        );
    }
}

export default DormsPage;
