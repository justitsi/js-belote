import styles from './GameUsernamePrompt.module.scss'
import { Row, Form, FormControl, Button, Jumbotron, FormLabel } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { connectToServerSocket, disconnectFromSocket } from './../../../modules/socketActions'

const GameUsernamePrompt = (props) => {
    const { t } = useTranslation('translations');
    const [socket, setSocket] = useState(null)
    const [clientID] = useState(uuidv4())
    const [usernameAvailable, setUsernameAvailable] = useState(false)
    const [spaceInGameRoom, setSpaceInGameRoom] = useState(false)
    const [error, setError] = useState("");

    //connect to server to check if room has space to join
    useEffect(() => {
        if (socket) disconnectFromSocket(socket);
        let socket_connection = connectToServerSocket(clientID);

        socket_connection.on("canJoinRoom", (args) => {
            setSpaceInGameRoom(args)
            if (args === false) setError('Room is full')
            else setError(null)
        });
        socket_connection.on("isUsernameAvailable", (args) => {
            setUsernameAvailable(args)
            if (args === false) {
                setError('Username taken');
            }
            else setError(null)
        });

        // emit event to check default name
        socket_connection.emit('canJoinRoom', props.roomID)
        socket_connection.emit('isUsernameAvailable', { roomID: props.roomID, displayName: props.displayName })
        setSocket(socket_connection);
        return () => {
            disconnectFromSocket(socket_connection);
        }
    }, [clientID, props.displayName, props.roomID]);

    const handleUsernameEnter = (event) => {
        // splitting this function in order to allow for checking of the
        // pre-generated username 
        handleUsernameUpdate(event.target.value.trim());
    }

    const handleUsernameUpdate = (username) => {
        props.setDisplayName(username);
        socket.emit('isUsernameAvailable', { roomID: props.roomID, displayName: username })
    }

    const btnActive = !(props.displayName && spaceInGameRoom && usernameAvailable);
    return (
        <div className={styles.loginContainer}>
            <Row className={styles.firstRow} />
            <Row fluid='sm'>
                <div className={styles.loginFormContainer}>
                    <div className={styles.loginForm}>
                        <Jumbotron>
                            <h3>{t('gameUsernamePrompt.roomIDLabel')} {props.roomID}</h3>
                            <div>
                                <Form>
                                    {error &&
                                        <label className={styles.errorText}>{error}</label>
                                    }
                                    <Form.Group>
                                        <FormControl
                                            type="text"
                                            placeholder={t('gameUsernamePrompt.usernameInputPlaceholder')}
                                            className="mr-sm-2"
                                            value={props.displayName}
                                            onChange={handleUsernameEnter}
                                        />
                                        <Form.Text className={"text-muted"}>
                                            {t("gameUsernamePrompt.usernameInputTooltip")}
                                        </Form.Text>
                                    </Form.Group>
                                    <div className={styles.joinBtnContainer}>
                                        <Button
                                            size="lg"
                                            variant="primary"
                                            type={'sumbit'}
                                            onClick={props.handleReadyToConnect}
                                            className={styles.joinBtn}
                                            disabled={btnActive}
                                        >
                                            {t('gameUsernamePrompt.joinGameBtnLabel')}
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Jumbotron>
                    </div>
                </div>
            </Row>
        </div >
    );

}
export default GameUsernamePrompt;