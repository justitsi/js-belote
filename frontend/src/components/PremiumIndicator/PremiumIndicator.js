import styles from './PremiumIndicator.module.scss'
import { useTranslation } from 'react-i18next';
import IndicatorBox from './../IndicatorBox'

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
            <IndicatorBox
                header={"Premiums"}
                scroll={true}
                content={
                    <ul className={styles.premiumsList}>
                        {premiums}
                    </ul>
                }
            />
        );
    }
    else {
        return (
            <div />
        );
    }
}

export default PremiumIndicator

