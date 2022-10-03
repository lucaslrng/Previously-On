import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import './styleCustomModal.css'

function CustomModal(props) {
    let subtitle;
    function afterOpenModal() {
        subtitle.style.color = '#f00';
    }
    return (
        <Modal show={props.modalIsOpen} onHide={props.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                {
                    props.errorMessage &&
                        <p className='modal__error'>{props.errorMessage}</p>
                }
                {
                    props.bottomButton && 
                        props.bottomButton
                }
            </Modal.Footer>
        </Modal>
    );
}

export default CustomModal;