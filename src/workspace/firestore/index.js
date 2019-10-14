import React from 'react'
import { EnsureLogin, TheHeader } from '../../app/libs/firebaseWrapper';
import Users from "./users";

const Home = (props) => {
    return (
        <React.Fragment>
            <TheHeader>Firebase</TheHeader>

            <EnsureLogin withSignInButton={true}>

                <Users />

            </EnsureLogin>
        </React.Fragment>
    )
}

export default Home;