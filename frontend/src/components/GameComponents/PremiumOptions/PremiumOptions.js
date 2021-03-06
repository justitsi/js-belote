import PremiumOption from './../PremiumOption'
import styles from './PremiumOptions.module.scss'
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap'

/*
This should be re-written to store the selected premiums in the parent component.
Right now it updates the selections in the parent when the selections are updated,
but it does not use the selections from the parent for its state. This is not optimal,
as the selections have to be synced, which requires an extra state update on the component
re-render, triggering an extra re-render on each state(selection) update. 
*/
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
            const premiumsToAnounce = getPremiumsToAnounce();

            setSelectedCPremiums([])
            setSelectedSPremiums([])
            // console.log(`anouncing premiums ${premiumsToAnounce}`)
            props.handleAnouncePremiums(premiumsToAnounce)
        }

        const getPremiumsToAnounce = () => {
            const premiumsToAnounce = []

            for (const index of selectedCPremiums) {
                if (props.availablePremiums.C[index]) {
                    const premium = {
                        cards: props.availablePremiums.C[index],
                        type: 'C'
                    }
                    premiumsToAnounce.push(premium)
                }
            }

            for (const index of selectedSPremiums) {
                if (props.availablePremiums.S[index]) {
                    const premium = {
                        cards: props.availablePremiums.S[index],
                        type: 'S'
                    }
                    premiumsToAnounce.push(premium)
                }
            }

            return premiumsToAnounce;
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

        // this is a bad solution, but it's 1 am, what are you gonna do about it
        if (props.selectedPremiums.length !== getPremiumsToAnounce().length)
            props.setSelectedPremiums(getPremiumsToAnounce());

        return (
            <div>
                {availablePremiumsList.length > 0 && props.roundStatus.pTurnName === props.displayName &&
                    < div className={styles.premiumOptionsContainer}>
                        <b className={styles.premiumsListLabel}> {t('premuimOptions.listLabel')} </b>
                        <div className={styles.premiumsList}>
                            {availablePremiumsList}
                            <small>
                                Selected premiums will be
                                <br />
                                anounced when you play a card
                            </small>
                        </div>
                    </div>
                }
            </div>
        )
    }
    else {
        return (
            <div />
        )
    }
}

export default PremiumOptions;