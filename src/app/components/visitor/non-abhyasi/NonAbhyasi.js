import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Button } from "semantic-ui-react";

import {
  RecordsTableWithEditor,
  validatePhoneNumber
} from "../../../libs/forms";
import { fetchRecs, setRecsPBOneRun } from "../../../libs/fetch";

import u from "../../../libs/utils";

import actions from "../../../actions/actions";
import { MyAuth } from "../../../auth/auth";

@connect(
  ({ localstorage: ls, globalstate: gs }) => ({
    loggedIn: u.loggedIn(ls),
    userName: u.userName(ls)
  }),
  actions
)
class TableAndForm extends Component {
  constructor(props) {
    super(props);
    this.SaveOrDelete = this.SaveOrDelete.bind(this);
  }

  componentWillMount() {
    this.setState({ is_create: true, data_orig: [], fetchme: null });
    if (this.props.loggedIn) {
      this.reload();
    }
  }

  reload(setrec = null) {
    // const run = {
    //   m: "avr.pages",
    //   f: ["id", "key", "value"],
    //   c: [["id", ">", 0]]
    // };
    // var X = () =>
    //   setrec === null ? fetchRecs(run) : setRecsPBOneRun([setrec], run);
    // this.setState({ loading: true });
    // X()
    //   .then(rows => {
    //     console.log(rows);
    //     this.setState({ data_orig: rows, loading: false });
    //   })
    //   .catch(e => {
    //     console.log(e);
    //     this.setState({ loading: false });
    //   });
  }
  SaveOrDelete(action, recid, data = {}, data_orig = {}) {
    console.log(action, data);
    var to_update_data = { ...data };

    if (action === "delete") {
      //to_update_data.deleted = 1;
      console.log("Delete not yet supported");
      return;
    }
    if (action === "save") {
    }
    // const setrec = {
    //   m: "avr.pages",
    //   c: [["id", "=", recid]],
    //   v: to_update_data
    // };
    // this.reload(setrec);
  }
  render() {
    const table_columns = [
      { header: "Id", column: "id" },
      { header: "Key", column: "key" },
      { header: "Value", column: "value" }
    ];

    const form_fields = this.getFormFields();

    return (
      <div>
        {!this.props.loggedIn && <MyAuth />}
        {this.props.loggedIn && (
          <div>
            <div>
              <RecordsTableWithEditor
                items_header={"My Records"}
                norecords_message="You have not yet created any record"
                newitem_header={"Add New Record"}
                edititem_header={"Edit Record"}
                newitem_button="Submit New Record"
                newItemDefaults={{}}
                table_columns={table_columns}
                items={[]}
                allow_edit={true}
                allow_create={true}
                allow_delete={false}
                form_fields={form_fields}
                handleRecordAction={this.SaveOrDelete}
                form_validator={vals => {
                  if ("key" in vals) {
                    const fn = vals.key;
                    if (fn.length < 6) {
                      return "Key needs to be greater than 6 letters";
                    }
                  }
                  if ("age" in vals && (vals.age < 25 || vals.age > 50)) {
                    return "Please enter between 25 and 50";
                  }
                  if ("mobile" in vals && !validatePhoneNumber(vals.mobile)) {
                    return "Invalid Mobile Number";
                  }
                  if (
                    "whatsapp" in vals &&
                    vals.whatsapp !== null &&
                    vals.whatsapp !== undefined &&
                    vals.whatsapp !== ""
                  ) {
                    if (!validatePhoneNumber(vals.whatsapp)) {
                      return "Invalid Whatsapp Number";
                    }
                  }
                  return "";
                }}
              />
              <div>
                <small>
                  <i>signed-in as {this.props.userName} </i>
                  <Button basic onClick={() => this.props.doLogout()}>
                    change user
                  </Button>
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  getFormFields() {
    return [
      { name: "Full Name", required: true, label: "Full Name", type: "text" },
      {
        name: "Phone Number",
        required: true,
        label: "Phone Number",
        type: "number"
      },
      {
        name: "Image",
        required: true,
        label: "Image",
        type: "image"
      }
      // {
      //   name: "Age",
      //   required: true,
      //   label: "Age",
      //   type: "number"
      // },
      // {
      //   name: "Gender",
      //   required: true,
      //   label: "Gender",
      //   type: "dropdown",
      //   options: [
      //     {
      //       key: "Male",
      //       text: "Male",
      //       value: "male"
      //     },
      //     {
      //       key: "Female",
      //       text: "Female",
      //       value: "female"
      //     },
      //     {
      //       key: "Other",
      //       text: "Other",
      //       value: "other"
      //     }
      //   ]
      // },
      // { name: "City", required: true, label: "City", type: "text" },
      // { name: "Country", required: true, label: "Country", type: "text" },
      // { name: "Email", label: "Email", type: "email" }
    ];
  }
}

export default class NonAbhyasi extends Component {
  render() {
    return (
      <div>
        <Segment color="blue">Non Abhyasi Registration </Segment>
        <Segment color="green">
          <TableAndForm />
        </Segment>
      </div>
    );
  }
}
