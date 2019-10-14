import React, { useState } from 'react';
import { DefaultButton, Modal } from 'office-ui-fabric-react';


function useModalOpen(props) {
    const [open, setOpen] = useState(!props.trigger);
    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    return [open, openModal, closeModal];
}

export const XModal = (props) => {

    const [open, openModal, closeModal] = useModalOpen(props);

    return (
        <React.Fragment>
            <DefaultButton onClick={openModal} text={props.trigger} />
            <Modal {...props} isOpen={open} onDismiss={closeModal}></Modal>
        </React.Fragment>
    )
}