import styles from './MainPage.module.scss'
import { useTranslation } from 'react-i18next';

function MainPage() {
    const { t } = useTranslation('translations');

    return (
        <div className={styles.page}>
            {t('test')}
            <br />
            <a href='#/belote/123'>the interesting stuff...</a>
        </div>
    );
}

export default MainPage;