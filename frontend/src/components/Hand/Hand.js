import styles from './Hand.module.scss'
import { useState } from 'react'
import Card from './../Card'
import { useTranslation } from 'react-i18next';

function Hand(props) {
    const { t } = useTranslation('translations');
    const [selected, setSelected] = useState(-1)

    const playSelectedCard = () => {
        if (selected !== -1) {
            props.playSelectedCard(props.cards[selected]);
            setSelected(-1)
        }
    }

    if (selected === -1 && props.validOptions)
        if (props.validOptions.lentgh === 0)
            setSelected(-1)


    let cardsToShow = []
    if (props.roundStatus === 'in_progress' || props.roundStatus === 'started_selecting_suit' || props.roundStatus === 'suit_selected')
        for (let i = 0; i < props.cardCount; i++) {
            let cardElement = null;
            if (props.showCards === true) {
                const selectHandler = (index) => {
                    if (index !== selected) setSelected(index)
                    else setSelected(-1)
                }

                let cardShouldBeActive = false
                for (const activeCard of props.validOptions) {
                    if (activeCard.suit === props.cards[i].suit && activeCard.rank === props.cards[i].rank)
                        cardShouldBeActive = true
                }

                cardElement =
                    <li className={props.vertical ? styles.verticalListItem : styles.horizontalListItem} key={i}>
                        <Card
                            rank={props.cards[i].rank}
                            suit={props.cards[i].suit}
                            index={i}
                            handleOnCLick={selectHandler}
                            selected={(i === selected)}
                            active={cardShouldBeActive && props.roundStatus === 'in_progress'}
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
            {props.showCards && selected !== -1 &&
                <button
                    className={styles.playCardButton}
                    onClick={playSelectedCard}
                >
                    {t("playerHand.playButtonLable")} {props.cards[selected].rank}{t(`cardSuits.${props.cards[selected].suit}`)}
                </button>
            }
        </div>
    );
}

export default Hand;