import styles from './GameStatusIndicator.module.scss'
// import { useTranslation } from 'react-i18next';
// import { useState } from 'react'

function GameStatusIndicator(props) {
    return (
        <div className={styles.statusContainer}>
            Belote Page: {JSON.stringify(props.gameStatus)}
        </div>
    );
}

export default GameStatusIndicator;