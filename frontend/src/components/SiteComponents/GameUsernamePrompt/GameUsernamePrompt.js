import styles from './GameUsernamePrompt.module.scss'
import { Row, Form, FormControl, Button, Jumbotron } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { connectToServerSocket, disconnectFromSocket } from './../../../modules/socketActions'

function GameUsernamePrompt(props) {
    const { t } = useTranslation('translations');
    const [socket, setSocket] = useState(null)
    const [clientID, setClientID] = useState(uuidv4())

    const [canJoin, setCanJoin] = useState(false)
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');

    //connect to server to check if room has space to join
    useEffect(() => {
        if (socket) disconnectFromSocket(socket);
        let socket_connection = connectToServerSocket(clientID);
        socket_connection.emit('canJoinRoom', props.roomID)


        socket_connection.on("canJoinRoom", (args) => {
            setCanJoin(args)
            if (args === false) setError('Room is full')
            else setError(null)
        });

        setSocket(socket_connection)
    }, [clientID, props.roomID]);

    const handleUsernameEnter = (event) => {
        props.setDisplayName(event.target.value)
        setUsername(event.target.value)
    }

    const btnActive = !(username && canJoin)

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
                                            value={username}
                                            onChange={handleUsernameEnter}
                                        />
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