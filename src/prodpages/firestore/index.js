import React from 'react'
import { EnsureLogin, TheHeader, xUserEmail } from '../../common/libs/firebaseWrapper';
import { Text } from 'office-ui-fabric-react';
import strings from './strings.json';
import Users from "./users";

const Home = (props) => {
    const who_am_i = xUserEmail();
    return (
        <React.Fragment>
            <TheHeader>
                {strings.index.header} <Text variant="small">{strings.index.confidential}</Text>
            
            </TheHeader>
            <div style={{height: "20px"}}/>
            <EnsureLogin withSignInButton={true}>
                {who_am_i && <Users who_am_i={who_am_i} />}
            </EnsureLogin>
        </React.Fragment>
    )
}

export default Home;