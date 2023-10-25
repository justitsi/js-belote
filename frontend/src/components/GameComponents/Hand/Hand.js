import styles from './Hand.module.scss'
import { useEffect, useState } from 'react'
import Card from '../Card'
import { useTranslation } from 'react-i18next';
import { sortCards } from './../../../modules/GameFunctions';
import { ReactComponent as ArrowIcon } from './../../../assets/icons/ArrowCardOrder.svg';
import { Button } from 'react-bootstrap'
import { log } from '../../../modules/util';

const Hand = (props) => {
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
    let activeCards = []
    if (props.roundStatus === 'in_progress' ||
        props.roundStatus === 'started_selecting_suit' ||
        props.roundStatus === 'suit_selected') {

        for (let i = 0; i < props.cardCount; i++) {
            let cardElement = null;
            let cardShouldBeActive = false

            if (props.showCards === true) {
                const selectHandler = (index) => {
                    if (index !== selected) setSelected(index)
                    else setSelected(-1)
                    log("debug", `${index}, ${selected}`)
                }

                for (const activeCard of props.validOptions) {
                    if (activeCard.suit === cardsInHand[i].suit && activeCard.rank === cardsInHand[i].rank)
                        cardShouldBeActive = true
                }

                cardElement =
                    <div className={props.vertical ? styles.verticalListItem : styles.horizontalListItem}
                        key={i}>
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
                    <div className={props.vertical ? styles.verticalListItem : styles.horizontalListItem}
                        key={i}>
                        <Card />
                    </div >
            }
            activeCards.push(cardShouldBeActive && props.roundStatus === 'in_progress')
            cardsToShow.push(cardElement)
        }
    }

    // function to handle keyboard events
    const handleKeyDown = (event) => {
        // handle selecting cards with keyboard only if event is not repeat
        if (event.repeat === false) {
            if (event.code.includes("Digit")) {
                const digit = parseInt(event.key)

                if (digit > 0) {
                    if (digit < cardsInHand.length + 1) {
                        // check if card can even be selected
                        let toSelectIndex = digit - 1;
                        if (reverseCardOrder) toSelectIndex = toSelectIndex % 8

                        log("debug", `Handling selecting card ${digit} using keyboard`)

                        // handle selection
                        if (activeCards[toSelectIndex]) setSelected(toSelectIndex);
                        else setSelected(-1);
                    }
                }
            }
            // handle playing selected card with keyboard
            if (event.code.toLowerCase() === "enter") {
                log("debug", 'Handling playing selected card from ENTER key');
                playSelectedCard();
            }
            if (event.code.toLowerCase() === "space") {
                log("debug", 'Handling playing selected card from SPACE key');
                playSelectedCard();
            }
        }
    }

    // setup event listeners for keyboard controls for game
    useEffect(() => {
        // handle adding event listener
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            // remove event listener after component unmount
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [props.validOptions])

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