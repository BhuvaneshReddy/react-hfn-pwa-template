import React, { Component } from "react";
import { Header, Form, Button, Label, Container } from "semantic-ui-react";
import BarCodeReader from "../../shared/BarCodeReader";

export default class Abhyasi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scanning: false,
      abhyasiBarCode: ""
    };
    this._scan = this._scan.bind(this);
    this._onDetected = this._onDetected.bind(this);
    this._handleScanBarcode = this._handleScanBarcode.bind(this);
    this._onFailure = this._onFailure.bind(this);
  }

  _scan() {
    this.setState({ scanning: !this.state.scanning });
  }

  _onDetected(result) {
    this.setState({ abhyasiBarCode: result.codeResult.code });
    this._scan();
    console.log("Scanned result", this.state.abhyasiBarCode);
  }

  _onFailure(err) {
    console.error("Error in scanning", err);
  }

  _handleScanBarcode(event) {
    this.setState({ abhyasiBarCode: event.target.value });
  }

  render() {
    return (
      <Container>
        <Header as="h2">Abhyasi Registration</Header>
        <Button onClick={this._scan}>
          {this.state.scanning ? "Stop Scanning" : "Start Scanning"}
        </Button>

        <br />

        {this.state.scanning ? (
          <BarCodeReader
            onSuccess={this._onDetected}
            onFailure={this._onFailure}
          />
        ) : null}
        <br />
        <Form>
          <Form.Field inline>
            <label>Scanned Barcode</label>
            <input
              placeholder="Barcode Reader output will appear here"
              onChange={this.handleScanBarcode}
            />
            <br />
            {this.state.code && <Button>Submit</Button>}
          </Form.Field>
        </Form>
      </Container>
    );
  }
}
