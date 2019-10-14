import React, { useState, useEffect } from 'react'
import { Text } from 'office-ui-fabric-react/lib/Text';
import { getFirebaseApp, xUserId } from '@heartfulnessinstitute/react-hfn-profile';
import UsersList from "./users-list";
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

const COLLECTION = 'JobApplications';


// export default class Users extends React.Component {

//     constructor(props) {
//         super(props);
//         this.toggleAll = this.toggleAll.bind(this);
//     }

//     componentWillMount() {
//         const uid = xUserId();
//         const fs = getFirebaseApp().firestore();
//         const collection = fs.collection(COLLECTION).where("assigned", "==", uid);
//         this.setState({ all: false, collection });
//     }
 
//     toggleAll() {
//         const fs = getFirebaseApp().firestore();
//         const { all, collection } = this.state;

//         if (all === false) {
//             let collection = fs.collection(COLLECTION);
//             this.setState({ all: true, collection });
//         } else {
//             let collection = fs.collection(COLLECTION).where("assigned", "==", uid);
//             this.setState({ all: true, collection });
//         }
//     }
//     render() {
//         const { all, collection } = this.state;

//         const str = all ? "All" : "My";
//         return (
//             <React.Fragment>
//                 <Text variant="large"> {str} Users</Text>
//                 <Toggle value={all} onChange={this.toggleAll} onText="Fiiltered My Records" offText="Showing All Records" />
//                 <UsersList firestore_collection={collection} />
//             </React.Fragment>
//         )
//     }
// }

const Users = (props) => {

    const uid = xUserId();
    const mycollection = getFirebaseApp().firestore().collection(COLLECTION);
    const [collection, setCollection] = useState(mycollection);
    const [all, setAll] = useState(1);

    function toggleAll() {
        if (all === 1) {
            setAll(0);
            setCollection(getFirebaseApp().firestore().collection(COLLECTION).where("assigned", "==", uid));
        } else {
            setAll(1);
            setCollection(getFirebaseApp().firestore().collection(COLLECTION));
        }
    }

    return (
        <React.Fragment>
            <br/>
            <Toggle  value={all} onChange={toggleAll} onText="Fiiltered My Records" offText="Showing All Records" />
                <UsersList key={all} firestore_collection={collection} />
        </React.Fragment>
    )
}

export default Users;