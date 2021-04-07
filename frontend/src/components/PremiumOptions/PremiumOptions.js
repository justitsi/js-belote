import PremiumOption from './../PremiumOption'
import styles from './PremiumOptions.module.scss'
import { useState } from 'react'
import { useTranslation } from 'react-i18next';

function PremiumOptions(props) {
    const { t } = useTranslation('translations');
    const [selectedCPremiums, setSelectedCPremiums] = useState([])
    const [selectedSPremiums, setSelectedSPremiums] = useState([])
    const availablePremiumsList = []
    let cIndex = 0;
    let sIndex = 0;

    const handlePremiumClick = (premiumType, index) => {
        let list

        if (premiumType === 'C') list = [...selectedCPremiums]
        if (premiumType === 'S') list = [...selectedSPremiums]

        // deselect if index is in arr
        if (list.includes(index)) list.splice(list.indexOf(index), 1);
        // select if index is not in arr 
        else list.push(index)

        if (premiumType === 'C') setSelectedCPremiums(list)
        if (premiumType === 'S') setSelectedSPremiums(list)
    }

    const handleAnouncePremiumsClick = () => {
        const premiumsToAnounce = []

        for (const index of selectedCPremiums) {
            const premium = {
                cards: props.availablePremiums.C[index],
                type: 'C'
            }
            premiumsToAnounce.push(premium)
        }

        for (const index of selectedSPremiums) {
            const premium = {
                cards: props.availablePremiums.S[index],
                type: 'S'
            }
            premiumsToAnounce.push(premium)
        }
        setSelectedCPremiums([])
        setSelectedSPremiums([])
        // console.log(`anouncing premiums ${premiumsToAnounce}`)
        props.handleAnouncePremiums(premiumsToAnounce)
    }

    for (const cardSeriesOption of props.availablePremiums.C) {
        let option = (
            <div
                className={styles.premiumsListItem}
                key={cIndex}
            >
                <PremiumOption
                    premiumCards={cardSeriesOption}
                    premiumType="C"
                    selected={selectedCPremiums.includes(cIndex)}
                    index={cIndex}
                    handleClick={handlePremiumClick}
                />
            </div>
        );
        cIndex++;
        availablePremiumsList.push(option)
    }

    for (const cardSeriesOption of props.availablePremiums.S) {
        let option = (
            <div
                className={styles.premiumsListItem}
                key={sIndex}
            >
                <PremiumOption
                    premiumCards={cardSeriesOption}
                    premiumType="S"
                    selected={selectedSPremiums.includes(sIndex)}
                    index={sIndex}
                    handleClick={handlePremiumClick}
                />
            </div>
        );
        sIndex++;
        availablePremiumsList.push(option)
    }

    return (
        <div>
            {availablePremiumsList.length > 0 &&
                <div className={styles.premiumOptionsContainer}>
                    <b className={styles.premiumsListLabel}> {t('premuimOptions.listLabel')} </b>
                    <div className={styles.premiumsList}>
                        {availablePremiumsList}
                        <button
                            className={styles.premiumOptionsAnounceBtn}
                            onClick={handleAnouncePremiumsClick}
                        >
                            {t('premuimOptions.anounceBtnLabel')}
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export default PremiumOptions;

// premiums have to be anounced like so:
// game.currentRound.anouncePlayerPremium('n', [{ suit: 'C', rank: '8' }, { suit: 'C', rank: '9' }, { suit: 'C', rank: '10' }], 'C')
