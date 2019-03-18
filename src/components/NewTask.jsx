import React, { useState, useEffect, useRef } from 'react';
import { FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function NewTask({ isOpen, closeModal, onSubmit, awaiting, added }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [text, setText] = useState('');
    const [alert, toggleAlert] = useState(false);
    const form = useRef();

    function handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        const formData = new FormData(form.current);
        if (!form.current.checkValidity()) {
            form.current.submit();
        } else {
            onSubmit(formData);
        }
    }

    useEffect(() => {
        if (added) {
            toggleAlert(true);
            setTimeout(() => {
                toggleAlert(false);
                closeModal();
            }, 3000);
        }

    }, [added]);

    return <Modal isOpen={isOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Add new task</ModalHeader>
        <ModalBody>
            <form id='addNewTaskForm' ref={form} onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Username</Label>
                    <Input name='username' value={username} onChange={(e) => setUsername(e.target.value)} maxLength={30} required />
                </FormGroup>
                <FormGroup>
                    <Label>Email</Label>
                    <Input name='email' type='email' value={email} onChange={(e) => setEmail((e.target.value))} required />
                </FormGroup>
                <FormGroup>
                    <Label>Text</Label>
                    <Input name='text' value={text} onChange={(e) => setText((e.target.value))} required />
                </FormGroup>
            </form>
        </ModalBody>
        <ModalFooter>
            <Button color='secondary' onClick={closeModal}>Close</Button>
            <Button type='submit' form='addNewTaskForm' color='primary'>
                {awaiting
                    ? <FontAwesomeIcon icon={faSpinner} spin />
                    : 'Submit'
                }
            </Button>
        </ModalFooter>
        <Alert color="success" isOpen={alert}>
            New task successfully added !
        </Alert>
    </Modal>;
}