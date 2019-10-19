import React from 'react'
import { EnsureLogin, TheHeader } from '../../app/libs/firebaseWrapper';
import Users from "./users";
import { Text } from 'office-ui-fabric-react';
import strings from './strings.json';

const Home = (props) => {
    return (
        <React.Fragment>
            <TheHeader>
                {strings.index.header} <Text variant="small">{strings.index.confidential}</Text>
            
            </TheHeader>
            <div style={{height: "20px"}}/>
            <EnsureLogin withSignInButton={true}>

                <Users />

            </EnsureLogin>
        </React.Fragment>
    )
}

export default Home;