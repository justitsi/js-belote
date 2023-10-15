import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { useTranslation } from 'react-i18next';
import { generateRandomString } from '../../../modules/util';
// import styles from './Navbar.module.scss';


const Our_Navbar = () => {
    const { t } = useTranslation('translations');
    const [roomID, setRoomID] = useState("");

    const handleSubmit = (evt) => {
        if (roomID) window.location.href = (`#/belote/room/${roomID}`);
        evt.stopPropagation();
        setRoomID("");
    }

    const handleRandomRoomClick = () => {
        console.log(window.location)
        if (!window.location.toString().includes("/belote/room/")) {
            let destRoom = generateRandomString(6)
            window.location.href = (`#/belote/room/${destRoom}`)
        };
    }

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#/">{t('navbar.brand')}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#/">{t('navbar.home')}</Nav.Link>
                    <Nav.Link onClick={handleRandomRoomClick}>{t('navbar.create_new_room')}</Nav.Link>
                </Nav>
                <Form inline>
                    <FormControl
                        type="text"
                        placeholder={t('navbar.gameIDLabel')}
                        className="mr-sm-2"
                        onChange={(evt) => { setRoomID(evt.target.value) }}
                        value={roomID}
                    />
                    <br />
                    <Button
                        onClick={handleSubmit}
                        type="submit"
                        variant="primary"
                        disabled={(!roomID)}
                    >
                        {t('navbar.joinGameBtnLabel')}
                    </Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Our_Navbar;