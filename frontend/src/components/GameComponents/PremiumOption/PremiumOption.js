import { useTranslation } from 'react-i18next';
import styles from './PremiumOption.module.scss'


function PremiumOption(props) {
    const { t } = useTranslation('translations');

    let premiumLabel;

    if (props.premiumType === 'C')
        premiumLabel = (
            <p className={styles.premiumLabel}>
                {t('premiumOption.cardSeriesLabel')} ({props.premiumCards.length} {t('premiumOption.cards')})
            </p>
        );

    if (props.premiumType === 'S')
        premiumLabel = (
            <p className={styles.premiumLabel}>
                {t('premiumOption.sameCardsLabel')}
            </p>
        );

    const cardsInPremiumListItems = []
    for (const card of props.premiumCards) {
        const premiumCardListItem = (
            <li className={styles.premiumCardListItem}>
                <b>{card.rank}{t(`cardSuitsSymbols.${card.suit}`)}</b>
            </li>
        );
        cardsInPremiumListItems.push(premiumCardListItem)
    }

    const handleOptionClick = () => {
        props.handleClick(props.premiumType, props.index)
    }

    let containerClass
    if (props.selected) containerClass = styles.premiumContainerSelected
    else containerClass = styles.premiumContainer

    return (
        <div
            className={containerClass}
            onClick={handleOptionClick}
        >
            {premiumLabel}
            <div className={styles.premiumCardList}>
                {cardsInPremiumListItems}
            </div>
            {/* {JSON.stringify(props)} */}
        </div>
    )
}
export default PremiumOption