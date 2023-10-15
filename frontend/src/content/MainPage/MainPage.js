import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { connectToServerSocket, disconnectFromSocket } from '../../modules/socketActions';
import { generateRandomString } from './../../modules/util';
import styles from './MainPage.module.scss';
import { useTranslation } from 'react-i18next';
import { Button, Col, Jumbotron, Row, Form, FormControl } from 'react-bootstrap';
import RoomIndicatorContainer from './../../components/SiteComponents/RoomIndicatorContainer';


const MainPage = (props) => {
    const navigate = useNavigate();
    const [roomID, setRoomID] = useState("");
    const [availableRooms, setAvailableRooms] = useState([]);

    //socket connection
    const { t } = useTranslation('translations');
    const [socket, setSocket] = useState(null)
    const [clientID] = useState(uuidv4())

    useEffect(() => {
        if (socket) disconnectFromSocket(socket);
        let socket_connection = connectToServerSocket(clientID);
        socket_connection.emit('getRoomList')

        socket_connection.on("roomListUpdate", (args) => {
            setAvailableRooms(args)
        });

        setSocket(socket_connection)

        return () => {
            socket_connection.disconnect()
        }
    }, [clientID]);



    const handleCTASubmit = (evt) => {
        let destRoom = roomID;
        if (!destRoom) destRoom = generateRandomString(6)

        navigate(`/belote/room/${destRoom}`);
        evt.stopPropagation();
        setRoomID("");
    }

    return (
        <div className={styles.page}>
            <br />
            <Row>
                <Col md={2}></Col>
                <Col md={8}>
                    <Jumbotron>
                        <Row>
                            <Col md={8}>
                                <h1>{t('mainPage.introSectionHeader')}</h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12} md={12} lg={8}>
                                <p>
                                    {t('mainPage.introSectionCTAText')}
                                </p>
                                <p>
                                    {t('mainPage.introSectionCTAText2')}
                                </p>
                            </Col>
                            <Col sm={12} md={12} lg={4}>
                                <div className={styles.introCTAButtonContainer}>
                                    <Form inline className={styles.introCTAButton}>
                                        <Form.Group>
                                            <FormControl
                                                type="text"
                                                placeholder={t('mainPage.joinGameByIDCTAPlaceholder')}
                                                className="mr-sm-2"
                                                onChange={e => setRoomID(e.target.value)}
                                                value={roomID}
                                            />
                                        </Form.Group>

                                        <Form.Group style={{ "marginTop": "0.5rem" }}>
                                            {!roomID &&
                                                <Button
                                                    variant="primary"
                                                    type={'sumbit'}
                                                    onClick={handleCTASubmit}
                                                    className={styles.introFormCTAButton}
                                                >
                                                    {t('mainPage.createNewGameRoomBtnLabel')}
                                                </Button>
                                            }
                                            {roomID &&
                                                <Button
                                                    variant="primary"
                                                    type={'sumbit'}
                                                    onClick={handleCTASubmit}
                                                    className={styles.introFormCTAButton}
                                                >
                                                    {t('navbar.joinGameBtnLabel')}
                                                </Button>
                                            }
                                        </Form.Group>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </Jumbotron>
                </Col>
                <Col md={2}></Col>
            </Row >
            <Row>
                <Col md={2}></Col>
                <Col md={8}>
                    <Jumbotron>
                        <h1>{t('mainPage.joinActiveRoomHeading')}</h1>
                        <p> {t('mainPage.joinActiveRoomParagraph')}</p>
                        <RoomIndicatorContainer
                            rooms={availableRooms}
                        />
                    </Jumbotron>
                </Col>
                <Col md={2}></Col>
            </Row>
        </div >
    );
}

export default MainPage;