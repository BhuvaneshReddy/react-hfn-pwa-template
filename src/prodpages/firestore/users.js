import React, { useState, useEffect } from 'react'
import { getFirebaseApp } from '@heartfulnessinstitute/react-hfn-profile';
import { PivotItem, Pivot } from 'office-ui-fabric-react/lib/Pivot';
import AdminsList from './admins-list';
import UsersList from "./users-list";

const CAREADMINS = 'CareAdmins';
const CAREUSERS = 'CareUsers';
const CARETRAINERS = 'CareTrainers';

function useAdmins(who_am_i) {
    //console.log(props);
    const [admin, setAdmin] = useState(false);
    useEffect(() => {
        const unsubscribe = getFirebaseApp().firestore().collection(CAREADMINS).where('email', '==', who_am_i)
            .onSnapshot((snapshot) => {
                let i_am_admin = snapshot.docs.length > 0;
                setAdmin(i_am_admin);
            })

        return () => unsubscribe();
    }, []);

    return admin
}

function Users(props) {
    const [CareAdmins] = useState(getFirebaseApp().firestore().collection(CAREADMINS));
    const [CareUsers] = useState(getFirebaseApp().firestore().collection(CAREUSERS));
    const [CareTrainers] = useState(getFirebaseApp().firestore().collection(CARETRAINERS));

    const who_am_i = props.who_am_i;
    if (!who_am_i) {
        return null
    }
    const i_am_admin = useAdmins(who_am_i);

    //console.log("WHO AM I ", who_am_i);
    return (
        <React.Fragment>
            <br />
            <Pivot key={i_am_admin}>
                <PivotItem headerText="My Patients">
                    <UsersList fcs={CareUsers} firestore_collection={CareUsers.where('caretrainer', '==', who_am_i)} scope="trainer" />
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