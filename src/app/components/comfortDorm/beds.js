import React, { Component } from 'react';
import './Bed.css';

class Beds extends Component {
    render() {
        const { beds } = this.props;

        const bedList = beds.map(bed => {
            return (
                <span key ={bed.bedId} style={{

                            width: "35px", height: "20px", textAlign: "center",

                                margin: "10px", display: "inline-block", background: "green"
                            

                }}>{bed.bedNum}</span>
            )
        })
        return(
            <div style={{
                width: "60%",
                margin: "auto",
                padding: "10px"}}>
                {bedList}
            </div>
        )
    }
}

export default Beds;
