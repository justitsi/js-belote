import styles from './Hand.module.scss'
import { useState } from 'react'
import Card from './../Card'

function Hand(props) {
    const [selected, setSelected] = useState(-1)

    const playSelectedCard = () => {
        if (selected !== -1) {
            props.playSelectedCard(props.cards[selected]);
        }
    }


    let cardsToShow = []
    for (let i = 0; i < props.cardCount; i++) {
        let cardElement = null;
        if (props.showCards === true) {
            const selectHandler = (index) => {
                if (index !== selected) setSelected(index)
                else setSelected(-1)
            }

            cardElement =
                <li className={props.vertical ? styles.verticalListItem : styles.horizontalListItem} key={i}>
                    <Card
                        rank={props.cards[i].rank}
                        suit={props.cards[i].suit}
                        index={i}
                        handleOnCLick={selectHandler}
                        selected={(i === selected)}
                    />
                </li>
        }
        else {
            cardElement =
                <li className={props.vertical ? styles.verticalListItem : styles.horizontalListItem} key={i}>
                    <Card />
                </li >
        }
        cardsToShow.push(cardElement)
    }

    return (
        <div className={styles.handContainer}>
            <ul className={props.vertical ? styles.verticalList : styles.horizontalList}>
                {cardsToShow}
            </ul>
            {props.showCards &&
                <button
                    className={styles.playCardButton}
                    onClick={playSelectedCard}
                >
                    Play selected card
                </button>
            }
        </div>
    );
}

export default Hand;