import React, { useState, useEffect } from 'react'
import { getFirebaseApp, xUserId, xUserEmail } from '@heartfulnessinstitute/react-hfn-profile';
import UsersList from "./users-list";
import { PivotItem, Pivot } from 'office-ui-fabric-react/lib/Pivot';
import AdminsList from './admins-list';

const CAREADMINS = 'CareAdmins';
const CAREUSERS = 'CareUsers';
const CARETRAINERS = 'CareTrainers';

function useAdmins() {
    //console.log(props);
    const [admin, setAdmin] = useState(false);
    useEffect(() => {
        const unsubscribe = getFirebaseApp().firestore().collection(CAREADMINS).where('email', '==', xUserEmail())
            .onSnapshot((snapshot) => {
                let i_am_admin = snapshot.docs.length > 0;
                setAdmin(i_am_admin);
            })

        return () => unsubscribe();
    }, []);

    return admin
}

const Users = (props) => {
    const [CareAdmins] = useState(getFirebaseApp().firestore().collection(CAREADMINS));
    const [CareUsers] = useState(getFirebaseApp().firestore().collection(CAREUSERS));
    const [CareTrainers] = useState(getFirebaseApp().firestore().collection(CARETRAINERS));

    const i_am_admin = useAdmins();

    return (
        <React.Fragment>
            <br />
            <Pivot key={i_am_admin}>
                <PivotItem headerText="My Patients">
                    <UsersList fcs={CareUsers} firestore_collection={CareUsers.where('caretrainer', '==', xUserEmail())} scope="trainer" />
                </PivotItem>
                {i_am_admin && <PivotItem headerText="All Patients (Admins Only)">
                    <UsersList fcs={CareUsers} firestore_collection={CareUsers} trainers={CareTrainers} scope="admin" />
                </PivotItem>
                }
                {i_am_admin && <PivotItem headerText="CARE Trainers (Admins Only)">
                    <AdminsList firestore_collection={CareTrainers} i_am_admin={i_am_admin}  />
                </PivotItem>}
               <PivotItem headerText="Admins">
                    <AdminsList firestore_collection={CareAdmins} i_am_admin={true} />
                </PivotItem>
                
       
         
            </Pivot>
        </React.Fragment>
    )
}

export default Users;