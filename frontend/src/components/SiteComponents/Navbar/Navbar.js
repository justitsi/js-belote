import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Form, Button, FormControl } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { generateRoomName } from '../../../modules/util';
import { SocketContext } from '../../../modules/socketContexts';
import styles from './Navbar.module.scss';
import favicon from '../../../assets/icons/favicon.png'


const Our_Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation('translations');
    const [serverClientID, serverSocket] = useContext(SocketContext);
    const [roomID, setRoomID] = useState("");

    // state variables for number of connected players
    const [numConnected, setNumConnected] = useState(-1);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // get data from socket
        serverSocket.on("numClientsPlayingUpdate", updateNumConnected);
        serverSocket.emit('getNumClientsPlaying');

        setIsConnected(true);
        return (() => {
            serverSocket.off("numClientsPlayingUpdate", updateNumConnected);
        })
    }, [serverClientID, serverSocket]);

    const updateNumConnected = (args) => {
        setNumConnected(args)
    }

    const handleSubmit = (evt) => {
        if (roomID) navigate(`/belote/room/${roomID}`);
        evt.stopPropagation();
        setRoomID("");
    }

    const handleRandomRoomClick = () => {
        if (!window.location.toString().includes("/belote/room/")) {
            let destRoom = generateRoomName();
            navigate(`/belote/room/${destRoom}`);
        };
    }

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand>
                <LinkContainer to={'/'}>
                    {/* {t('navbar.brand')} */}
                    <Nav.Link>

                        <div>
                            <img src={favicon} className={styles.logo} alt="fireSpot" />
                        </div>
                    </Nav.Link>
                </LinkContainer>
            </Navbar.Brand>
            {/*
            isConnected represent connection attempt, not actual connection - rely on 
            check in server that guarantees never less than 0 players connected 
            */}
            {isConnected &&
                <div>
                    {(numConnected > 0) &&
                        <div className={styles.playersOnlineIndicator}>
                            <a className={styles.onlineIcon}>{'\u25CF'} </a> {numConnected} {t('navbar.playersOnline')}
                        </div>
                    }
                    {(numConnected === 0) &&
                        <div className={styles.playersOnlineIndicator}>
                            <a className={styles.onlineIcon}>{'\u25CF'} </a> {t('navbar.connected')}
                        </div>
                    }
                    {(numConnected === -1) &&
                        <div className={styles.playersOnlineIndicator}>
                            <a className={styles.offlineIcon}>{'\u25CF'} </a> {t('navbar.disconnected')}
                        </div>
                    }
                </div>
            }
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
        </Navbar >
    );
}

export default Our_Navbar;