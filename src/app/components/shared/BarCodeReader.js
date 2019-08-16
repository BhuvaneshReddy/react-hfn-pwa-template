import React, { Component } from "react";
import Quagga from "quagga";

class BarCodeReader extends Component {
  constructor(props) {
    super(props);
    this._onSuccess = this._onSuccess.bind(this);
    this._onFailure = this._onFailure.bind(this);
  }

  componentDidMount() {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#interactive") // Or '#yourElement' (optional)
        },
        decoder: {
          readers: ["code_128_reader"]
        },
        numOfWorkers: 0,
        multiple: false
      },
      function(err) {
        if (err) {
          console.log(err);

          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
      }
    );

    Quagga.onDetected(this._onSuccess);
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onSuccess);
    Quagga.stop();
  }

  _onSuccess(result) {
    this.props.onSuccess(result);
  }

  _onFailure(error) {
    this.props.onFailure(error);
  }

  render() {
    return <div id="interactive" className="viewport" />;
  }
}

export default BarCodeReader;
