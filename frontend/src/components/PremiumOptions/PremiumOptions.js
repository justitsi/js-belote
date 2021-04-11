import PremiumOption from './../PremiumOption'
import styles from './PremiumOptions.module.scss'
import { useState } from 'react'
import { useTranslation } from 'react-i18next';

function PremiumOptions(props) {
    const { t } = useTranslation('translations');
    const [selectedCPremiums, setSelectedCPremiums] = useState([])
    const [preselectedCPremiums, setPreselectedCPremiums] = useState(false)
    const [selectedSPremiums, setSelectedSPremiums] = useState([])
    const [preselectedSPremiums, setPreselectedSPremiums] = useState(false)
    const availablePremiumsList = []
    let cIndex = 0;
    let sIndex = 0;

    if (props.roundStatus) {
        // preselect all premiums being rendered
        if (preselectedCPremiums === false && props.availablePremiums.C.length > 0) {
            const list = [...selectedCPremiums]
            for (let i = 0; i < props.availablePremiums.C.length; i++)
                list.push(i)

            setSelectedCPremiums(list)
            setPreselectedCPremiums(true)
        }
        if (preselectedSPremiums === false && props.availablePremiums.S.length > 0) {
            const list = [...selectedSPremiums]
            for (let i = 0; i < props.availablePremiums.S.length; i++)
                list.push(i)

            setSelectedSPremiums(list)
            setPreselectedSPremiums(true)
        }

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
            // preselect all indexes being rendered
            const list = [...selectedSPremiums]
            if (!list.includes(sIndex)) {
                list.push(sIndex)
                setSelectedSPremiums(list)
            }

            sIndex++;
            availablePremiumsList.push(option)
        }

        return (
            <div>
                {availablePremiumsList.length > 0 && props.roundStatus.pTurnName === props.displayName &&
                    < div className={styles.premiumOptionsContainer}>
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
            </div >
        )
    }
    else {
        return (
            <div />
        )
    }
}

export default PremiumOptions;