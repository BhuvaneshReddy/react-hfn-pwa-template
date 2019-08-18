import React, { Component } from 'react';
import './comfortDorm.css';
import Beds from './beds';
import { Grid, Image } from 'semantic-ui-react';
import {BrowserRouter, Route} from 'react-router-dom'




import { Segment, Button, Dimmer, Loader } from 'semantic-ui-react';

class ComfortDorm extends Component {

    componentWillMount() {
        this.setState({ loading: false, output: null });
    }

    goToRoomSelections = (name) => {
        this.props.history.push('/room-selection', {selected: name});
    }

    render() {
        // let roomList = [
        //     {
        //         roomKey: 'BG1',
        //         roomName: 'BG1',
        //         freeBedsCount: 12,
        //         roomType: 'family'
        //     },
        //     {
        //         roomKey: 'BG2',
        //         roomName: 'BG2',
        //         freeBedsCount: 12,
        //         roomType: 'family'
        //     },
        //     {
        //         roomKey: 'BG3',
        //         roomName: 'BG3',
        //         freeBedsCount: 12,
        //         roomType: 'family'
        //     }
        // ]

        // let bedList = [
        //     {
        //         bedId: 'BG1-1',
        //         roomKey: 'BG1',
        //         bedNum: 1
        //     },
        //     {
        //         bedId: 'BG1-2',
        //         roomKey: 'BG1',
        //         bedNum: 2
        //     },
        //     {
        //         bedId: 'BG1-3',
        //         roomKey: 'BG1',
        //         bedNum: 3
        //     },
        //     {
        //         bedId: 'BG1-4',
        //         roomKey: 'BG1',
        //         bedNum: 4
        //     },
        //     {
        //         bedId: 'BG1-5',
        //         roomKey: 'BG1',
        //         bedNum: 5
        //     },
        //     {
        //         bedId: 'BG1-6',
        //         roomKey: 'BG1',
        //         bedNum: 6
        //     },
        //     {
        //         bedId: 'BG1-8',
        //         roomKey: 'BG1',
        //         bedNum: 8
        //     },
        //     {
        //         bedId: 'BG1-9',
        //         roomKey: 'BG1',
        //         bedNum: 9
        //     }
        // ]

        let dormA = {
            name: 'Dorm A',
            freeBedsCount: 430
        };

        let dormB = {
            name: 'Dorm B',
            freeBedsCount: 342
        };

        let dormC = {
            name: 'Dorm C',
            freeBedsCount: 99
        };

        let dormD = {
            name: 'Dorm D',
            freeBedsCount: 230
        };

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
                Please click on your preferred dorm to start booking
                </div>
                <div style={{
                    background: "#039be5",
                    width: "30%",
                    margin: "20px auto",
                    borderRadius: "25px"
                }}>
                    <Grid celled='internally' columns={2}>
                        <Grid.Row>
                            <Grid.Column
                                textAlign="center"
                                verticalAlign="middle"
                                onClick={()=>{this.goToRoomSelections(dormC.name)}}
                                style={{
                                    cursor: "pointer",
                                    height: "100px",
                                    color: "white"                                  
                                }}>
                                <span style={{fontSize: "20px"}}>{dormC.name}</span><br/>
                                <span>{dormC.freeBedsCount} free</span>
                            </Grid.Column>

                            <Grid.Column
                                textAlign="center"
                                verticalAlign="middle"
                                style={{
                                    cursor: "pointer",
                                    height: "100px",
                                    color: "white"                                                                    
                                }}>
                                <span style={{fontSize: "20px"}}>{dormD.name}</span><br/>
                                <span>{dormD.freeBedsCount} free</span>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column
                                textAlign="center"
                                verticalAlign="middle"
                                style={{
                                    cursor: "pointer",
                                    height: "100px",
                                    color: "white"                                 
                                }}>
                                <span style={{fontSize: "20px"}}>{dormB.name }</span><br/>
                                <span>{dormB.freeBedsCount} free</span>
                            </Grid.Column>

                            <Grid.Column
                                textAlign="center"
                                verticalAlign="middle"
                                style={{
                                    cursor: "pointer",
                                    height: "100px",
                                    color: "white"
                                   
                                }}>
                                <span style={{fontSize: "20px"}}>{dormA.name}</span><br/>
                                <span>{dormA.freeBedsCount} free</span>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
         
                
                {/* <Beds beds={bedList} /> */}
            </div>
        );
    }

}

export default ComfortDorm;
