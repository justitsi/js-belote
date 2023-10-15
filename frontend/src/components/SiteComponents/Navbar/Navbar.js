import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Form, Button, FormControl } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { generateRandomString } from '../../../modules/util';

const Our_Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation('translations');
    const [roomID, setRoomID] = useState("");

    const handleSubmit = (evt) => {
        if (roomID) navigate(`/belote/room/${roomID}`);
        evt.stopPropagation();
        setRoomID("");
    }

    const handleRandomRoomClick = () => {
        if (!window.location.toString().includes("/belote/room/")) {
            let destRoom = generateRandomString(6)
            navigate(`/belote/room/${destRoom}`)
        };
    }

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">{t('navbar.brand')}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer to={'/'}>
                        <Nav.Link>
                            {t('navbar.home')}
                        </Nav.Link>
                    </LinkContainer>
                    {/* only show new room button if not currently entering room */}
                    {(!location.pathname.includes("/belote/room/")) &&
                        <Nav.Link onClick={handleRandomRoomClick}>{t('navbar.create_new_room')}</Nav.Link>
                    }
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