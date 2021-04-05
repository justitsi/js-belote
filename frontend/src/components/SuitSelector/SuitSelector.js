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

    return (
        <div className={styles.suitSelectionGridContainer}>
            <div />
            <div className={styles.suitSelectionGrid}>
                <form>
                    <select
                        name="suits"
                        onChange={event => setSelectedSuit(event.target.value)}
                    >
                        {listOfSuits}
                    </select>
                    <button onClick={handleOptionSelect}>Select suit</button>
                </form>
                <div>
                    <br />
                    Current Suit: {props.suit}
                </div>
                <div>
                    Anounced By: {props.calledBy}
                </div>
            </div>
        </div>
    );
}
export default SuitSelector