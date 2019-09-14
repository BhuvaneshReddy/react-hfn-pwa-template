import React, { Component } from 'react';
import { Input, Modal, Form, Button, Confirm, Segment, Header, Table, Icon, Message } from "semantic-ui-react";
import isNil from 'lodash/isNil';
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'

const isnotnull = (x) => (!isNil(x) && x !== "");

const toTitleCase = (t) => {
    var i, j, str, lowers, uppers;
    str = t.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless 
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
        'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0, j = lowers.length; i < j; i++)
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
            function (txt) {
                return txt.toLowerCase();
            });

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++)
        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
            uppers[i].toUpperCase());

    return str;
}

export const MyInput = (props) => <Input {...props} defaultValue={get(props.dict, props.name, '')}
    onBlur={(e) => get(props.dict, props.name, '') !== e.target.value && 'onBlur' in props ? props.onBlur(props.name, e.target.value) : {}}
/>

export const MyInputDataList = (props) => <span>
    <Input {...props} list={props.name} defaultValue={get(props.dict, props.name, '')}
        onBlur={(e) => get(props.dict, props.name, '') !== e.target.value && 'onBlur' in props ? props.onBlur(props.name, e.target.value) : {}}
    />
    <datalist id={props.name}
    >
        {props.options.map((option, kidx) => <option key={kidx} value={option} />)}
    </datalist>
</span>


export const Statistic = (props) => (<div className="column"><div className="ui statistic">
    <div className="value"> {props.v}</div> <div className="label">{props.k}</div>
</div></div>);

export const month_options = Object.entries({
    '1': "January", '2': 'Febraury', '3': 'March', '4': 'April', '5': 'May', '6': 'June',
    '7': 'July', '8': 'August', '9': 'September', '10': 'October', '11': 'November', '12': 'December'
}).map(e => ({ key: e[0], text: e[1], value: e[0] }));

export const gender_options = [
    'Male', 'Female'
].map(a => ({ key: a, text: a, value: a }));

export const indiastate_options = [
    "ANDAMAN AND NICOBAR ISLANDS",
    "ANDHRA PRADESH",
    "ARUNACHAL PRADESH",
    "ASSAM",
    "BIHAR",
    "CHANDIGARH",
    "CHHATTISGARH",
    "DADRA AND NAGAR HAVELI",
    "DAMAN AND DIU",
    "DELHI",
    "GOA",
    "GUJARAT",
    "HARYANA",
    "HIMACHAL PRADESH",
    "JAMMU AND KASHMIR",
    "JHARKHAND",
    "KARNATAKA",
    "KERALA",
    "LAKSHADWEEP",
    "MADHYA PRADESH",
    "MAHARASHTRA",
    "MANIPUR",
    "MEGHALAYA",
    "MIZORAM",
    "NAGALAND",
    "ODISHA",
    "PUDUCHERRY",
    "PUNJAB",
    "RAJASTHAN",
    "SIKKIM",
    "TAMIL NADU",
    "TELANGANA",
    "TRIPURA",
    "UTTARAKHAND",
    "UTTAR PRADESH",
    "WEST BENGAL"
].map(a => ({ key: a, text: toTitleCase(a), value: toTitleCase(a) }));


export function validateRE(re1, txt) {
    var re = RegExp(re1);
    return re.test(String(txt));
}




export class RecordEditor extends Component {

    componentWillMount() {

        var callbacks = {};
        this.props.fields
            .filter(f => ('c' in f && "callback" in f.c))
            .map(f => { callbacks[f.name] = f.c.callback; return 0; });

        const { values } = this.props;
        
        this.setState({
            ...(values),
            values_dirty: Object.assign({}, this.props.is_create && isnotnull(values) ? values : {}),
            delete_confirm: false,
            validation_errors: '',

            callbacks,
        });
    }

    setEdited = (e, { name, value, type }) => {
        console.log(name, value, type);
        e.preventDefault();
        if (isnotnull(value)) {
            var { values_dirty } = this.state;

            if (type === 'number') {
                value = parseInt(value);
            }

            if (type === 'text' || type === 'email') {
                value = value.trim()
            }

            values_dirty[name] = value;
            this.setState({ [name]: value, values_dirty });

            if (name in this.state.callbacks) {
                this.state.callbacks[name](name, value);
            }
        }

    }

    renderField = (f, idx) => {
        const { type } = f;
        switch (type) {
            case 'group':
                return (<Form.Group key={idx}>
                    {f.fields.map(this.renderField)}
                </Form.Group>
                );
            case 'dropdown':
                return (
                    <Form.Dropdown
                        key={idx} selection
                        {...f} c="0" selectOnBlur={false}
                        defaultValue={get(this.state, f.name)}
                        onChange={this.setEdited}
                    />
                );
            case 'textarea':
                return (
                    <Form.TextArea
                        key={idx}
                        {...f} c="0"
                        defaultValue={get(this.state, f.name)}
                        onChange={this.setEdited}
                    />
                );
            default:
                return (
                    <Form.Input
                        key={idx}
                        {...f} c="0"
                        defaultValue={get(this.state, f.name)}
                        onChange={this.setEdited}
                    />
                );
        }
    }


    render() {

        const { closeEditor, header, fields, is_create, allow_delete, validator } = this.props;

        return (
            <Modal
                open={true}
                onClose={() => closeEditor('close', {})}
                closeIcon>


                <Modal.Header>
                    {(typeof header === "function") ? header(this.state) : header}

                    {!is_create && allow_delete === true &&
                        <span>

                            <Button floated="right" color="red"
                                onClick={() => this.setState({ delete_confirm: true })}>
                                Delete Record
                            </Button>
                            <Confirm open={this.state.delete_confirm}
                                header={"Delete Record"}
                                confirmButton="Yes"
                                cancelButton="No"
                                onCancel={() => this.setState({ delete_confirm: false })}
                                onConfirm={() => {
                                    closeEditor('delete', {});
                                    this.setState({ delete_confirm: false });
                                }}
                            />
                        </span>
                    }
                </Modal.Header>
                <Modal.Content image>


                    <Modal.Description>
                        <Form error={this.state.validation_errors !== ''}
                            onSubmit={() => {

                                if (typeof validator === 'function') {
                                    var x = validator(this.state);
                                    this.setState({ validation_errors: x });
                                    if (x !== '') {
                                        return;
                                    }
                                }

                                closeEditor('save', this.state.values_dirty)
                            }}
                        >
                            {fields
                                .filter(f => (!('c' in f)) || (!('visible' in f.c) || ((is_create && f.c.visible === 'create') || (!is_create && f.c.visible === 'edit'))))
                                .map(this.renderField)
                            }


                            <Message
                                error
                                content='Please correct the invalid values'
                                header={this.state.validation_errors}
                            />
                            <Form.Button color="blue" type="submit"
                                icon="save" content="Save" />
                        </Form>

                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>


                    <Button onClick={() => closeEditor('close', {})}
                        content="Discard" icon="cancel" />

                </Modal.Actions>
            </Modal>

        )
    }
}

export class RecordsTable extends Component {

    renderContent() {
        const { rows, columns, subheader, doEdit, doCreate, norecords_message } = this.props;
        const show_edit_btn = 'doEdit' in this.props;
        const show_newrec_btn = "doCreate" in this.props;
        var { newRowDefaults, cardRender } = this.props;

        const is_summary_footer = columns.filter(r => 'summary' in r).length > 0;

        const summary = {};

        if (is_summary_footer) {
            const scols = columns.filter(r => 'summary' in r);
            scols.map(s => { summary[s.column] = 0; return 0; });
            rows.map(row => {
                scols.map(s => {
                    if (s.summary === 'sum') {
                        summary[s.column] += row[s.column];
                    } else if (s.summary === 'count') {
                        summary[s.column] += 1;
                    } else {
                        summary[s.column] = s.summary;
                    }
                    return 0
                })
                return 0

            })
        }


        return (<div>

            {subheader}

            {rows.length === 0 ?
                <Table><Table.Body><Table.Row><Table.Cell>{norecords_message ||  "No Records Available"}</Table.Cell></Table.Row></Table.Body></Table>

                : (isnotnull(cardRender) ?

                    <div>
                        {rows.map((row, ridx) => {
                            return <div key={ridx}>
                                {cardRender(row, (show_edit_btn &&



                                    ((!('deleted' in row) || row["deleted"] === 0) ?
                                        <Button icon="edit" basic
                                            onClick={() => doEdit({ ...row })}
                                        />
                                        : "Deleted"
                                    )
                                )
                                )
                                }

                            </div>
                        })}
                    </div>

                    : <div style={{ overflowX: "auto", marginBottom: "15px" }}>
                        <Table  unstackable collapsing striped>
                            <Table.Header>
                                <Table.Row>
                                    {columns.map((h, i) =>
                                        <Table.HeaderCell key={i}> {h.header}</Table.HeaderCell>)}
                                    {show_edit_btn &&
                                        <Table.HeaderCell></Table.HeaderCell>
                                    }
                                </Table.Row>
                            </Table.Header>
                            <Table.Body key={rows.length}>
                                {rows.map((row, ridx) => (
                                    <Table.Row key={ridx}>
                                        {columns.map((h, i) =>
                                            <Table.Cell key={ridx + '' + i}>
                                                {"transform" in h ? h.transform(row[h.column]) : row[h.column]}
                                            </Table.Cell>)}
                                        {show_edit_btn &&

                                            <Table.Cell>

                                                {(!('deleted' in row) || row["deleted"] === 0) ?
                                                    <Button icon="edit" basic
                                                        onClick={() => doEdit(Object.assign({}, row))}
                                                    />
                                                    : "Deleted"
                                                }
                                            </Table.Cell>
                                        }

                                    </Table.Row>
                                ))}
                            </Table.Body>
                            {is_summary_footer &&

                                <Table.Footer>
                                    <Table.Row>
                                        {columns.map((h, i) =>
                                            <Table.HeaderCell key={i}> {get(summary, h.column, "")} </Table.HeaderCell>)}
                                        {show_edit_btn &&
                                            <Table.HeaderCell></Table.HeaderCell>
                                        }
                                    </Table.Row>
                                </Table.Footer>
                            }
                        </Table>

                    </div>
                )
            }
            {show_newrec_btn &&
                <Button color="blue" style={{ marginTop: "15px" }} onClick={() => {
                    if (isNil(newRowDefaults)) {
                        newRowDefaults = {}
                    }
                    doCreate(newRowDefaults);
                }}>
                    <Icon name='plus' />
                    {get(this.props, 'newitem_button', "New Record")}
                </Button>

            }
        </div>

        )
    }
    render() {
        const { header } = this.props;


        const hdr = (typeof header === "function") ? header() : header;


        return (
            <div>

                {isnotnull(hdr) &&
                    <Segment textAlign="left" attached="top">

                        <Header>
                            {hdr}
                        </Header>
                    </Segment>

                }
                {isnotnull(hdr) ? <Segment attached> {this.renderContent()} </Segment>
                    :

                    this.renderContent()
                }
            </div>
        );

    }
}

export class RecordsTableWithEditor extends Component {

    componentWillMount() {
        this.setState({ edit_record: null, is_create: false });
    }
    render() {

        const { items_header, items_subheader, table_columns, items, newItemDefaults,
            allow_edit, allow_create, allow_delete, form_fields, form_validator, handleRecordAction, cardRender,

            group_by, group_by_header, norecords_message
        } = this.props;

        const newitem_header = get(this.props, 'newitem_header', "Add New Record");
        const edititem_header = get(this.props, 'edititem_header', "Edit Record");
        const newitem_button = get(this.props, 'newitem_button', "New Record");


        var rtprops = {}
        if (allow_edit === true) {
            rtprops.doEdit = (edit_record) => this.setState({ edit_record, is_create: false });
        }
        if (allow_create === true) {
            rtprops.newRowDefaults = newItemDefaults;
            rtprops.doCreate = (edit_record) => this.setState({ edit_record, is_create: true });
            rtprops.newitem_button = newitem_button;
        }

        if (isnotnull(cardRender)) {
            rtprops.cardRender = cardRender
        }


        var item_groups = { all_items: items };
        if (isnotnull(group_by)) {
            item_groups = groupBy(items, group_by);
        }

        return (
            Object.entries(item_groups).map((e, itdx) =>
                <div key={itdx}>

                    <RecordsTable
                        header={isnotnull(group_by) ? group_by_header(e[0]) : items_header}
                        subheader={items_subheader}
                        norecords_message={norecords_message}
                        columns={table_columns}
                        rows={e[1]}
                        {...rtprops}
                    />

                    {
                        isnotnull(this.state.edit_record) &&
                        <RecordEditor
                            header={this.state.is_create ? newitem_header : edititem_header}
                            values={this.state.edit_record}
                            is_create={this.state.is_create}
                            fields={form_fields}
                            validator={form_validator}
                            allow_delete={allow_delete}
                            closeEditor={(action, data) => {
                                if (['save', 'delete'].includes(action)) {
                                    handleRecordAction(action, 'id' in this.state.edit_record ? this.state.edit_record.id : 0, data, this.state.edit_record);
                                }
                                this.setState({ edit_record: null, is_create: false });
                            }}
                        />

                    }
                </div>
            )
        );
    }
}