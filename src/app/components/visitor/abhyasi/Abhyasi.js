import React, { Component } from 'react';
import { Button, Form, Select } from 'semantic-ui-react';
import { firebaseApp } from '@heartfulnessinstitute/react-hfn-profile';

import BarCodeReader from '../../shared/BarCodeReader';
import u from '../../../libs/utils';

export default class Abhyasi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scanning: false,
      abhyasiBarCode: '',
      inTime: null,
      options: [
        { key: 'en', value: 'entry', text: 'Entry' },
        { key: 'ex', value: 'exit', text: 'Exit' }
      ]
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
    this.setState({
      abhyasiBarCode: result.codeResult.code,
      inDate: new Date()
    });
    this._scan();
    u.log('Scanned result', this.state.abhyasiBarCode);
  }

  _onFailure(err) {
    u.error('Error in scanning', err);
  }

  _handleScanBarcode(event) {
    this._onDetected(event.target.value);
  }

  handleChange = event => {
    this.setState({ abhyasiBarCode: event.target.value });
  };

  handleFormSubmit = () => {
    this.setState({ inDate: new Date() });
    firebaseApp
      .firestore()
      .collection('visitors')
      .doc('Abhyasi')
      .collection('data')
      .add({
        abhyasiBarCode: this.state.abhyasiBarCode,
        inTime: Date.now()
      })
      .then(value => {
        console.log('Document added successfully');
        this.setState({ abhyasiBarCode: '', inDate: null });
      });
  };

  render() {
    return (
      <div>
        <Button onClick={this._scan}>
          {this.state.scanning ? 'Stop Scanning' : 'Start Scanning'}
        </Button>

        <br />

        {this.state.scanning ? (
          <BarCodeReader
            onSuccess={this._onDetected}
            onFailure={this._onFailure}
          />
        ) : null}
        <br />
        <Form onSubmit={this.handleFormSubmit}>
          <Form.Field>
            <label>Scanned Barcode</label>
            <input
              placeholder="Barcode Reader output will appear here"
              value={this.state.abhyasiBarCode}
              onChange={this.handleChange}
              required
            />
            <br />
            <br />
            <Select
              placeholder="Select Operation"
              options={this.state.options}
            />
            <br />
            <br />
            <Button primary>Submit</Button>
          </Form.Field>
        </Form>
      </div>
    );
  }
}
