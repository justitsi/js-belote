import styles from './GameBoard.module.scss'
import { useTranslation } from 'react-i18next';
// import Hand from './../Hand'
import Card from './../Card';
import Hand from './../Hand';

function GameBoard(props) {
    const { t } = useTranslation('translations');

    //card order
    // [0] - south
    // [1] - east
    // [2] - north
    // [3] - west

    let sCard = { displayEmpty: true }
    let eCard = { displayEmpty: true }
    let nCard = { displayEmpty: true }
    let wCard = { displayEmpty: true }
    if (props.cards[0]) sCard = props.cards[0]
    if (props.cards[1]) eCard = props.cards[1]
    if (props.cards[2]) nCard = props.cards[2]
    if (props.cards[3]) wCard = props.cards[3]

    //card order
    // [0] - east
    // [1] - north
    // [2] - west

    let eNumOfCards = 0
    let nNumOfCards = 0
    let wNumOfCards = 0
    if (props.numOfCardsInHand[0]) eNumOfCards = props.numOfCardsInHand[0]
    if (props.numOfCardsInHand[1]) nNumOfCards = props.numOfCardsInHand[1]
    if (props.numOfCardsInHand[2]) wNumOfCards = props.numOfCardsInHand[2]


    const eSecondColumnCardCount = Math.floor(eNumOfCards / 2)
    const eFirstColumnCardCount = eNumOfCards - eSecondColumnCardCount

    const wSecondColumnCardCount = Math.floor(wNumOfCards / 2)
    const wFirstColumnCardCount = wNumOfCards - wSecondColumnCardCount

    const playerIndicator = (
        <div style={{ color: "black", textAlign: "center", margin: "auto" }}>
            {t('gameBoard.playerTurnIndicator')} {props.pTurn}
        </div>
    );

    return (
        <div className={styles.overAllContainer}>
            <div />
            <Hand
                showCards={false}
                cardCount={nNumOfCards}
                vertical={false}
            />
            <div />
            <div className={styles.handsSideBySide}>
                <div className={styles.verticalCardContainer}>
                    <Hand
                        showCards={false}
                        cardCount={wFirstColumnCardCount}
                        vertical={true}
                    />
                </div>
                <div className={styles.verticalCardContainer}>
                    <Hand
                        showCards={false}
                        cardCount={wSecondColumnCardCount}
                        vertical={true}
                    />
                </div>
            </div>
            <div className={styles.gameBoardContainer}>
                <div className={styles.tableContainer}>
                    <div className={styles.tableGrid}>
                        <div />  <Card {...nCard} /> <div />
                        <Card {...wCard} /> {playerIndicator} <Card {...eCard} />
                        <div />  <Card {...sCard} /> <div />
                    </div>
                </div>
            </div >
            <div className={styles.handsSideBySide}>
                <div className={styles.verticalCardContainer}>
                    <Hand
                        showCards={false}
                        cardCount={eFirstColumnCardCount}
                        vertical={true}
                    />
                </div>
                <div className={styles.verticalCardContainer}>
                    <Hand
                        showCards={false}
                        cardCount={eSecondColumnCardCount}
                        vertical={true}
                    />
                </div>
            </div>
        </div>
    );
}

export default GameBoard;