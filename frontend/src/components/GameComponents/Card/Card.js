import styles from './Card.module.scss'
import { useTranslation } from 'react-i18next';
import ManagerComponent from './../../../assets/cards/ManagerComponent'


const Card = (props) => {
    const { t } = useTranslation('translations');

    const handleOnCLick = () => {
        if (props.active)
            props.handleOnCLick(props.index)
    }

    // handle a card the player sees
    if (props.suit && props.rank) {
        let textClass = styles.blackSuit
        if (props.suit === 'H' || props.suit === 'D') textClass = styles.redSuit
        return (
            <div className={props.selected ? styles.selectedCardContainer : styles.cardContainer}
                onClick={handleOnCLick}
            >
                <div className={props.active ? null : styles.inactiveOverlay}>
                    <ManagerComponent
                        suit={props.suit}
                        rank={props.rank}
                    />
                </div>
            </div >
        );
    }
    // handle a card the player doesn't see
    else {
        if (props.displayEmpty) {
            return (
                <div
                    className={styles.cardContainer}
                    style={{
                        backgroundColor: "green"
                    }}
                />
            );
        }
        else {
            return (
                <div className={styles.blankCardContainer} >
                    <div className={styles.emptyCard}>
                        <div className={styles.svgContainer} />
                    </div>
                </div >
            );
        }
    }
}

export default Card;