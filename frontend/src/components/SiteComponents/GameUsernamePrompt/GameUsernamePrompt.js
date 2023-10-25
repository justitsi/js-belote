import styles from './GameUsernamePrompt.module.scss'
import { Row, Form, FormControl, Button, Jumbotron } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const GameUsernamePrompt = (props) => {
    const { t } = useTranslation('translations');

    const handleUsernameEnter = (event) => {
        // splitting this function in order to allow for checking of the
        // pre-generated username 
        handleUsernameUpdate(event.target.value.trim());
    }

    const handleUsernameUpdate = (username) => {
        props.setDisplayName(username);
        props.socketConn.emit('isUsernameAvailable', { roomID: props.roomID, displayName: username })
    }

    const handleSubmit = (event) => {
        // stop form submit from reloading page
        event.stopPropagation();
        event.preventDefault();
        if (props.displayName && props.spaceInGameRoom && props.usernameAvailable)
            props.handleReadyToConnect();
    }

    const btnActive = !(props.displayName && props.spaceInGameRoom && props.usernameAvailable);
    return (
        <div className={styles.loginContainer}>
            <Row className={styles.firstRow} />
            <Row fluid='sm'>
                <div className={styles.loginFormContainer}>
                    <div className={styles.loginForm}>
                        <Jumbotron>
                            <h3>{t('gameUsernamePrompt.roomIDLabel')} {props.roomID}</h3>
                            <div>
                                <Form onSubmit={handleSubmit}>
                                    {props.error &&
                                        <label className={styles.errorText}>{props.error}</label>
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
                                            onClick={handleSubmit}
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