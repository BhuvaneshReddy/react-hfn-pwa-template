import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { fetchRecs, setRecsPBOneRun, fetchAggregates } from '../../../libs/fetch';



class RoomSelection extends Component {

    state = {
        buttonList: null
    }

    componentDidMount() {
        let freerooms = {
            "m": ["avr_resource_reserve"],
            "gf": ["l1", "l2"],
            "cf": ['id'],
            "c": [['status', '=', 'free']],
            "hr": ['Group', 'Room', "Free"]
        };

        fetchAggregates(freerooms).then(output => {
            const list = output.rows.map(room => {
                let text = 'Room' + ' ' + room[1] + ' ' + '(' + room[2] + ')';
                return (
                    <div
                        style={{
                            marginTop: '10px'
                        }}>
                        <Button content={text} primary />
                    </div>

                )

            })

            this.setState({ buttonList: list });
        })
    }

    render() {
        return (
            <div>
                <header style={{
                    display: "flex",
                    alignItems: 'center',
                    background: "#2D2D2D",
                    height: "60px",
                    padding: "10px",
                    fontSize: "18px",
                    color: "white"
                }}>
                    <span>Comfort Dorm Booking Page</span>
                </header>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        height: "40px",
                        fontSize: "16px",
                        boxShadow:" 0 10px 6px -6px #777",
                        padding: "15px"

                    }}>
                    Please select from the available rooms
                </div>

                <div
                    style={{
                        width: "30%",
                        margin: "20px auto"
                    }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row"
                        }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                background: "#cfd5ea",
                                padding: "15px",
                                borderRadius: "20px",
                                textAlign: "center",
                                marginRight: "30px"
                            }}>
                            <div>GROUND</div>
                            <div>FLOOR</div>
                            {this.state.buttonList}

                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                background: "#cfd5ea",
                                padding: "10px",
                                borderRadius: "20px",
                                textAlign: "center"
                            }}>
                            <div>FIRST</div>
                            <div>FLOOR</div>
                            {this.state.buttonList}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RoomSelection;