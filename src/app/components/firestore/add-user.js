import React, { useState } from 'react'

const AddUser = (props) => {
    console.log(props);
    const [firstname, setFirstname] = useState('');
    const [creator, setCreator] = useState('');

    function onSubmit(e) {
        e.preventDefault();

        props
        .firestore_ref
        .add({
            firstname,
            creator
        })
        .then(() => {
            setFirstname('');
            setCreator('');
        })
    }

    return (
        <form onSubmit={onSubmit}>
            <h4>Add User</h4>
            <div>
                <label>Firstname</label>
                <input type="text" value={firstname} onChange={e => setFirstname(e.currentTarget.value)} />                
            </div>

            <div>
                <label>Creator</label>
                <input type="text" value={creator} onChange={e => setCreator(e.currentTarget.value)} />                
            </div>

            <button>Save</button>
        </form>
    )
}

export default AddUser