import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';


import 'semantic-ui-css/semantic.min.css';

export default @connect(state => ({}))

class Home extends Component {
  render() {
    return (
      <div>
          <h1>PWA with MySRCM APIs - Boilerplate</h1>

        <div>
        </div>
        <br/>
        <Button href="#page1">Page 1</Button>
        <br />
        <br />
        <Button href="#page2">Page 2</Button>
     </div>
    );
  }
}
