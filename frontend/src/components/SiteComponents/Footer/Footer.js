import styles from './Footer.module.scss'
import { Row, Col, Button, Jumbotron } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import signature from './../../../assets/images/logo.png';

function Footer(props) {
    const { t } = useTranslation('translations');

    return (
        <Jumbotron className={styles.footerContainer}>
            {/* <Row>
                <Col sm={3} md={4} lg={4} />
                <Col sm={6} md={4} lg={4}>
                    <p className={styles.moreInfoLabel}>
                        {t('footer.moreInfoLabel')}
                    </p>
                </Col>
            </Row>
            <br /> */}
            <Row>
                <Col sm={0} md={1} lg={2} />
                <Col sm={12} md={10} lg={8}>
                    <Row>
                        <Col sm={12} md={6} lg={3}>
                            <p>
                                {t('footer.cookieStatement1')}
                                <br />
                                {t('footer.cookieStatement2')}
                            </p>
                        </Col>
                        <Col sm={12} md={6} lg={6}>
                            <p>
                                {t('footer.copyright')}
                                <a href={"https://github.com/justitsi/js-belote/blob/master/LICENSE"}>
                                    {t('footer.copyrightLinkLabel')}
                                </a>.
                            </p>

                            <p>
                                {t('footer.githubLinkExplanation')}
                                <a href={"https://github.com/justitsi/js-belote/issues/new/choose"}>
                                    {t('footer.githubLinkLabel')}
                                </a>.
                            </p>
                        </Col>
                        <Col sm={12} md={12} lg={3}>
                            <a href={"https://justitsi.tk"}>
                                <img
                                    className={styles.signature}
                                    src={signature}
                                    alt="Logo"
                                />
                            </a>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Jumbotron >
    );
}
export default Footer;

/*
    Footer layout:
    SM:
    Col1
    Col2
    Col3

    MD:
    Col1 Col2
    Col3

    >=LG:
    Col1 Col2 Col3
*/