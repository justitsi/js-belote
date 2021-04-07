import styles from './SuitSelector.module.scss'

import { useTranslation } from 'react-i18next';
import { useState } from 'react'
import CONSTANTS from './../../modules/CONSTANTS.json'

function SuitSelector(props) {
    const { t } = useTranslation('translations');
    const [selectedSuit, setSelectedSuit] = useState('P')

    const handleOptionSelect = (event) => {
        event.preventDefault();
        props.handleSuitSelect(selectedSuit)
    }

    const listOfSuits = []
    for (const call of props.options) {
        listOfSuits.push(
            <option
                value={call}
                key={call}
            >
                {call}
            </option>
        )
    }

    const previuosSuitsList = []
    for (const selectedSuit of props.suitSelectionHistory) {
        if (selectedSuit.suitSelection !== 'P') {
            const previousSuitListItem = (
                <div className={styles.previousBidsListItem}>
                    {selectedSuit.madeBy} {t('suitSelector.anounced')} {t(`suitSelector.suits.${selectedSuit.suitSelection}`)}
                </div>
            );
            previuosSuitsList.push(previousSuitListItem)
        }
    }
    previuosSuitsList.reverse()

    return (
        <div className={styles.suitSelectionGridContainer}>
            <div />
            <div className={styles.suitSelectionGrid}>
                <form className={styles.suitSelectionForm}>
                    <select
                        name="suits"
                        className={styles.suitSelectionFormSelect}
                        onChange={event => setSelectedSuit(event.target.value)}
                    >
                        {listOfSuits}
                    </select>
                    <div className={styles.suitSelectionFormSpacer} />
                    <button
                        onClick={handleOptionSelect}
                        className={styles.suitSelectionFormBtn}
                    >
                        {t('suitSelector.selectBtnLabel')}
                    </button>
                </form>
                <div>
                    {t('suitSelector.currentSuitLabel')} {props.suit}
                </div>
                <div>
                    {t('suitSelector.anouncedByLabel')} {props.calledBy}
                </div>
                {previuosSuitsList.length > 0 &&
                    <div>
                        <b>{t('suitSelector.previousBidsLabel')}</b>

                        <div className={styles.previousBidsContainer}>
                            {previuosSuitsList}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
export default SuitSelector