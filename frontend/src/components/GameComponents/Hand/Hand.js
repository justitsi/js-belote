import styles from './Hand.module.scss'
import { useState } from 'react'
import Card from '../Card'
import { useTranslation } from 'react-i18next';
import { sortCards } from './../../../modules/GameFunctions';
import { ReactComponent as ArrowIcon } from './../../../assets/icons/ArrowCardOrder.svg';
import { Button, Container } from 'react-bootstrap'

function Hand(props) {
    const { t } = useTranslation('translations');
    const [selected, setSelected] = useState(-1);
    const [reverseCardOrder, setReverseCardOrder] = useState(false);

    let cardsInHand = [];
    if (props.roundStatus === 'in_progress' || props.roundStatus === 'started_selecting_suit' || props.roundStatus === 'suit_selected')
        cardsInHand = sortCards([...props.cards], props.suitInfo, reverseCardOrder)

    const playSelectedCard = () => {
        if (selected !== -1) {
            props.playSelectedCard(cardsInHand[selected]);
            setSelected(-1)
        }
    }

    if (selected === -1 && props.validOptions)
        if (props.validOptions.lentgh === 0)
            setSelected(-1)


    let cardsToShow = []
    if (props.roundStatus === 'in_progress' || props.roundStatus === 'started_selecting_suit' || props.roundStatus === 'suit_selected') {

        for (let i = 0; i < props.cardCount; i++) {
            let cardElement = null;
            if (props.showCards === true) {
                const selectHandler = (index) => {
                    if (index !== selected) setSelected(index)
                    else setSelected(-1)
                    console.log(index, selected,)
                }

                let cardShouldBeActive = false
                for (const activeCard of props.validOptions) {
                    if (activeCard.suit === cardsInHand[i].suit && activeCard.rank === cardsInHand[i].rank)
                        cardShouldBeActive = true
                }

                cardElement =
                    <div className={props.vertical ? styles.verticalListItem : styles.horizontalListItem} key={i}>
                        <Card
                            rank={cardsInHand[i].rank}
                            suit={cardsInHand[i].suit}
                            index={i}
                            handleOnCLick={selectHandler}
                            selected={(i === selected)}
                            active={cardShouldBeActive && props.roundStatus === 'in_progress'}
                        />
                    </div>
            }
            else {
                cardElement =
                    <div className={props.vertical ? styles.verticalListItem : styles.horizontalListItem} key={i}>
                        <Card />
                    </div >
            }
            cardsToShow.push(cardElement)
        }
    }

    return (
        <div className={styles.handContainer}>
            <div className={props.vertical ? styles.verticalList : styles.horizontalList}>
                {cardsToShow}
            </div>
            <div className={styles.btnContainer}>
                {cardsToShow.length > 0 &&
                    <Button
                        className={styles.switchCardDirectionButton}
                        variant="outline-secondary"
                        onClick={() => { setSelected(-1); setReverseCardOrder(!reverseCardOrder); }}
                    >
                        {reverseCardOrder &&
                            <ArrowIcon className={styles.arrowRotated} />
                        }
                        {!reverseCardOrder &&
                            <ArrowIcon />
                        }
                    </Button>
                }
                {props.showCards && selected !== -1 &&
                    <Button
                        className={styles.playCardButton}
                        onClick={playSelectedCard}
                        variant="outline-primary"
                    >
                        <b>
                            {t("playerHand.playButtonLable")} {cardsInHand[selected].rank}{t(`cardSuits.${cardsInHand[selected].suit}`)}
                        </b>
                    </Button>
                }
            </div>
        </div>
    );
}

export default Hand;