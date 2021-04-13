import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { useTranslation } from 'react-i18next';
// import styles from './Navbar.module.scss';


const Our_Navbar = () => {
    const { t } = useTranslation('translations');
    const [roomID, setRoomID] = useState("");

    const handleSubmit = (evt) => {
        window.location.href = (`#/belote/${roomID}`);
        evt.stopPropagation();
        setRoomID("");
    }

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#/">{t('navbar.brand')}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#/">{t('navbar.home')}</Nav.Link>
                    <Nav.Link href="#/search">{t('navbar.test_room')}</Nav.Link>
                </Nav>
                <Form inline>
                    <FormControl
                        type="text"
                        placeholder={t('navbar.gameIDLabel')}
                        className="mr-sm-2"
                        onChange={e => setRoomID(e.target.value)}
                        value={roomID}
                    />
                    <Button onClick={handleSubmit} type="submit" variant="outline-success">{t('navbar.joinGameBtnLabel')}</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Our_Navbar;