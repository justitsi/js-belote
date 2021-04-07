import styles from './PremiumIndicator.module.scss'
import { useTranslation } from 'react-i18next';


function PremiumIndicator(props) {
    const { t } = useTranslation('translations');

    if (props.premiums) {
        const premiums = []

        for (const premium of props.premiums) {
            const listItem = (
                <li
                    key={props.premiums.indexOf(premium)}
                    className={styles.premiumsListItem}
                >
                    {premium.belongsTo} anounced {t(`premiumTypes.${premium.premiumType}`)}

                    {premium.premiumType === 'C' &&
                        `(${premium.cards.length} Cards) `
                    }

                for {premium.points} points.
                </li>
            );
            premiums.push(listItem)
        }

        return (
            <div className={styles.premiumIndicatorContainer}>
                <h3 className={styles.premiumIndicatorLabel}>Premiums</h3>
                <ul className={styles.premiumsList}>
                    {premiums}
                </ul>
            </div >
        );
    }
    else {
        return (
            <div>
                No premiums passed
            </div>
        );
    }
}

export default PremiumIndicator

