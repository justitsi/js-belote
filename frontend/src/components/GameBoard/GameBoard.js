import styles from './GameBoard.module.scss'
import { useTranslation } from 'react-i18next';
import { useState } from 'react'
import Card from './../Card';
import Hand from './../Hand';
import SuitSelector from './../SuitSelector';

function GameBoard(props) {
    const { t } = useTranslation('translations');
    const [splitOnCardIndex, setSplitOnCardIndex] = useState(16)
    const [promptCardErrorText, setPromptCardErrorText] = useState(null)


    const reArrangeArrToLocalOrder = (arrayOfItems) => {
        let playerArr = [...props.roundStatus.players]
        const localUserame = props.localUsername

        const offSetIndex = playerArr.indexOf(localUserame);
        const arrPiece = arrayOfItems.splice(0, offSetIndex)
        return arrayOfItems.concat(arrPiece)
    }

    let localPlayerPositions = []
    let localCardCounts = [[], [], []]
    let localCardsOnTable = [{ displayEmpty: true }, { displayEmpty: true }, { displayEmpty: true }, { displayEmpty: true }]
    let tableCenter = null
    let eNumOfCards = 0
    let nNumOfCards = 0
    let wNumOfCards = 0


    if (props.roundStatus) {
        localPlayerPositions = reArrangeArrToLocalOrder([...props.roundStatus.players])
        const playerIndicator = (
            <div style={{ color: "black", textAlign: "center", margin: "auto" }}>
                {t('gameBoard.playerTurnIndicator')} {props.roundStatus.pTurnName}
            </div>
        );

        if (props.roundStatus.status === 'waiting_for_split') {
            if (props.roundStatus.pTurnName === props.localUsername) {

                const handleSplitIndexSelect = (event) => {
                    event.preventDefault();
                    if (splitOnCardIndex > 0 && splitOnCardIndex < 32) {
                        // console.log(splitOnCardIndex)
                        props.handleDeckSplit(splitOnCardIndex)
                    }
                    else {
                        setSplitOnCardIndex(16)
                        setPromptCardErrorText('Please enter a number between 0 and 32')
                    }
                }

                tableCenter = (
                    < div className={styles.splitPromptContainer} >
                        <div className={styles.splitPromptTextContainer}>
                            <p>{t('gameBoard.deckSplitPromptText')}</p>
                            <p className={styles.splitPromptTextContainerErrorText}>
                                {promptCardErrorText}
                            </p>
                        </div>
                        <div>
                            <form>
                                <input
                                    type="number"
                                    onChange={event => setSplitOnCardIndex(event.target.value)}
                                    value={splitOnCardIndex}
                                />
                                <br />
                                <button
                                    className={styles.splitPromptFromSubmitButton}
                                    onClick={handleSplitIndexSelect}
                                >
                                    {t('gameBoard.deckSplitPromptSubmitButtonText')}
                                </button>
                            </form>
                        </div>
                    </div >
                );
            }
            else {
                tableCenter = (
                    < div className={styles.tableGrid} >
                        {/* this is a 3x3 grid */}
                        < div />< div />< div />
                        < div /><div />< div />
                        < div />{playerIndicator}< div />
                    </div >
                );
            }
        }
        else {
            localCardCounts = reArrangeArrToLocalOrder([...props.roundStatus.handSizes])
            localCardCounts.shift()
            // console.log(localCardCounts)

            if (props.roundStatus.status === 'started_selecting_suit') {
                if (props.roundStatus.pTurnName === props.localUsername) {
                    let selectedSuit = 'P';

                    let suitOptions = []
                    if (props.validSuitOptions) suitOptions = props.validSuitOptions

                    tableCenter = (
                        < div className={styles.splitPromptContainer} >
                            <div className={styles.splitPromptTextContainer}>
                                <p>{t('gameBoard.suitSelectPromptText')}</p>
                                <p className={styles.splitPromptTextContainerErrorText}>
                                    {promptCardErrorText}
                                </p>
                            </div>
                            <SuitSelector
                                options={suitOptions}
                                suit={props.roundStatus.suitInfo.suit}
                                calledBy={props.roundStatus.suitInfo.caller}
                                handleSuitSelect={props.handleSuitSelect}
                            />
                        </div >
                    );

                }
                else {
                    tableCenter = (
                        < div className={styles.tableGrid} >
                            {/* this is a 3x3 grid */}
                            < div />< div />< div />
                            < div /><div />< div />
                            < div />{playerIndicator}< div />
                        </div >
                    );
                }
            }
            else {
                if (props.roundStatus.status === 'over' && props.roundScore) {
                    console.log(props.roundScore)
                    tableCenter = (
                        < div className={styles.splitPromptContainer} >
                            <div className={styles.splitPromptTextContainer}>
                                <h4>{t('gameBoard.roundOverPromptText')}</h4>
                                <p className={styles.splitPromptTextContainerErrorText}>
                                    {promptCardErrorText}
                                </p>
                            </div>
                            {props.roundScore &&
                                <table className={styles.roundOverTable}>
                                    <tr>
                                        <th />
                                        <th>Team 1 points</th>
                                        <th>Team 2 points</th>
                                    </tr>
                                    {props.roundScore.card_scores &&
                                        <tr>
                                            <th>Points from cards</th>
                                            <td>{props.roundScore.card_scores[0]}</td>
                                            <td>{props.roundScore.card_scores[1]}</td>
                                        </tr>
                                    }
                                    {props.roundScore.premium_scores &&
                                        <tr>
                                            <th>Points from premiums</th>
                                            <td>{props.roundScore.premium_scores[0]}</td>
                                            <td>{props.roundScore.premium_scores[1]}</td>
                                        </tr>
                                    }
                                    {props.roundScore.premium_scores && props.roundScore.card_scores &&
                                        <tr>
                                            <th>Total</th>
                                            <th>{(props.roundScore.card_scores[0] + props.roundScore.premium_scores[0])}</th>
                                            <th>{(props.roundScore.card_scores[1] + props.roundScore.premium_scores[1])}</th>
                                        </tr>
                                    }
                                </table>

                            }
                            <p>Next round will start in 10 secs</p>
                        </div >
                    );
                }
                else {

                    //figure out local table card placements
                    for (const card of props.roundStatus.cardsOnTable) {
                        const tmpIndex = localPlayerPositions.indexOf(card.placedBy);
                        if (tmpIndex > -1)
                            localCardsOnTable[tmpIndex] = card;
                    }

                    let sCard = localCardsOnTable[0]
                    let eCard = localCardsOnTable[1]
                    let nCard = localCardsOnTable[2]
                    let wCard = localCardsOnTable[3]

                    tableCenter = (
                        < div className={styles.tableGrid} >
                            {/* this is a 3x3 grid */}
                            < div />
                            <Card {...nCard} handleOnCLick={() => { }} active={true} />
                            <div />
                            <Card {...wCard} handleOnCLick={() => { }} active={true} />
                            {playerIndicator}
                            <Card {...eCard} handleOnCLick={() => { }} active={true} />
                            <div />
                            <Card {...sCard} handleOnCLick={() => { }} active={true} />
                            <div />
                        </div >
                    );
                }
            }
        }
    }

    eNumOfCards = localCardCounts[0]
    nNumOfCards = localCardCounts[1]
    wNumOfCards = localCardCounts[2]

    const eSecondColumnCardCount = Math.floor(eNumOfCards / 2)
    const eFirstColumnCardCount = eNumOfCards - eSecondColumnCardCount

    const wSecondColumnCardCount = Math.floor(wNumOfCards / 2)
    const wFirstColumnCardCount = wNumOfCards - wSecondColumnCardCount



    return (
        <div className={styles.overAllContainer}>
            <div />
            <Hand
                showCards={false}
                cardCount={nNumOfCards}
                vertical={false}
                roundStatus={props.roundStatus.status}
            />
            <div />
            <div className={styles.handsSideBySide}>
                <div className={styles.verticalCardContainer}>
                    <Hand
                        showCards={false}
                        cardCount={wFirstColumnCardCount}
                        vertical={true}
                        roundStatus={props.roundStatus.status}
                    />
                </div>
                <div className={styles.verticalCardContainer}>
                    <Hand
                        showCards={false}
                        cardCount={wSecondColumnCardCount}
                        vertical={true}
                        roundStatus={props.roundStatus.status}
                    />
                </div>
            </div>
            <div>
                <div className={styles.horizontalPlayerTag}>
                    {localPlayerPositions[2]}
                </div>
                <div className={styles.displayElementsInOneLine}>
                    <div className={styles.verticalPlayerTagLeft}>
                        {localPlayerPositions[3]}
                    </div>
                    <div className={styles.gameBoardContainer}>
                        <div className={styles.tableContainer}>
                            {tableCenter}
                        </div>
                    </div >
                    <div className={styles.verticalPlayerTagRight}>
                        {localPlayerPositions[1]}
                    </div>
                </div>
                <div className={styles.horizontalPlayerTag}>
                    {localPlayerPositions[0]}
                </div>
            </div>
            <div className={styles.handsSideBySide}>
                <div className={styles.verticalCardContainer}>
                    <Hand
                        showCards={false}
                        cardCount={eFirstColumnCardCount}
                        vertical={true}
                        roundStatus={props.roundStatus.status}
                    />
                </div>
                <div className={styles.verticalCardContainer}>
                    <Hand
                        showCards={false}
                        cardCount={eSecondColumnCardCount}
                        vertical={true}
                        roundStatus={props.roundStatus.status}
                    />
                </div>
            </div>
        </div>
    );

}

export default GameBoard;