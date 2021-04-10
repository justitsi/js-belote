import styles from './MainPage.module.scss'
import { useTranslation } from 'react-i18next';
import { Button, Jumbotron } from 'react-bootstrap';

function MainPage() {
    const { t } = useTranslation('translations');

    return (
        <div className={styles.page}>
            <Jumbotron>
                <h1>Hello, world!</h1>
                <p>
                    This is a simple belote game - join the test room here
                </p>
                <p>
                    <a href='/#/belote/test'>
                        <Button variant="primary">Join test room</Button>
                    </a>
                </p>
            </Jumbotron>
        </div>
    );
}

export default MainPage;