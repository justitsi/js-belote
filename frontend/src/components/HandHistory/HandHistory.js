import styles from './HandHistory.module.scss'
import IndicatorBox from './../IndicatorBox'
import { useTranslation } from 'react-i18next';

function HandHistory(props) {
    const { t } = useTranslation('translations');

    const history = []
    if (props.roundStatus.handHistory) {
        //create table header
        const players = [...props.roundStatus.players]
        const playerNames = []
        for (const player of players) {
            playerNames.push(
                <th key={player} className={styles.tablePlayerName}>
                    {player}
                </th>
            );
        }

        // create table rows and data cells
        for (const historyItem of props.roundStatus.handHistory) {
            const rowItems = [null, null, null, null]
            //create rows
            for (const historyCard of historyItem.cards) {
                let item
                if (historyCard.rank === historyItem.strongest.rank && historyCard.suit === historyItem.strongest.suit)

                    item = (
                        <td className={styles.strongestCardTD} key={historyCard.rank + historyCard.suit}>
                            {historyCard.rank}{historyCard.suit}
                        </td>
                    );
                else
                    item = (
                        <td className={styles.cardTD} key={historyCard.rank + historyCard.suit}>
                            {historyCard.rank}{historyCard.suit}
                        </td>
                    );


                rowItems.splice(players.indexOf(historyCard.placedBy), 0, item);
            }


            const historyTR = (
                <tr key={historyItem.cards[0].rank + historyItem.cards[0].suit}>
                    {rowItems}
                </tr>
            );
            history.push(historyTR);
        }

        history.reverse()
        // if game is in progress cut history so only last three cards are visible
        if (history.length > 3 && props.roundStatus.status === 'in_progress') history.length = 3
        // make the table always have 3 data rows so that it doesn't change size in the begining of the game
        while (history.length < 3) history.push(<tr />)

        let containerHeader
        if (props.roundStatus.status === 'in_progress') containerHeader = t('handHistory.containerLabel3Hands')
        else if (props.roundStatus.status === 'over') containerHeader = t('handHistory.containerLabelFull')
        else containerHeader = t('handHistory.containerLabel')

        return (
            <div>
                <IndicatorBox
                    header={containerHeader}
                    content={
                        <div className={styles.tableContainer} >
                            <table className={styles.historyTable}>
                                <thead>
                                    <tr>
                                        {playerNames}
                                    </tr>
                                </thead>
                                {history.length > 0 &&
                                    <tbody>
                                        {history}
                                    </tbody>
                                }
                            </table>
                        </div>
                    }
                />
            </div>
        );
    }
    else {
        return (
            <div />
        );
    }
}
export default HandHistory;