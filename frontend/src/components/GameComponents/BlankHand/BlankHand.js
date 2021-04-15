import styles from './BlankHand.module.scss'
import Card from '../Card'

function BlankHand(props) {
    let cardsToShow = []
    if (props.roundStatus === 'in_progress' || props.roundStatus === 'started_selecting_suit' || props.roundStatus === 'suit_selected')
        for (let i = 0; i < props.cardCount; i++) {
            const cardElement = (
                <div className={props.vertical ? styles.verticalListItem : styles.horizontalListItem} key={i}>
                    <Card />
                </div >
            );
            cardsToShow.push(cardElement)
        }


    return (
        <div className={styles.handContainer}>
            <div className={props.vertical ? styles.verticalList : styles.horizontalList}>
                {cardsToShow}
            </div>
        </div>
    );
}

export default BlankHand;