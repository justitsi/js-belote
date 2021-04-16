import styles from './RoundScoreTable.module.scss'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap'

function RoundScoreTable(props) {
    const { t } = useTranslation('translations');
    const [secondsLeft, setSecondsLeft] = useState(15);

    useEffect(() => {
        setTimeout(() => {
            if (secondsLeft !== 0) setSecondsLeft(secondsLeft - 1);
        }, 1000);
    });

    // add last 10 points to the team that got the last 4 cards
    const lastHandPoints = [0, 0]
    const totalRoundPoints = [0, 0]

    if (props.roundScore.card_scores) {
        // check if any round scores were issued - if both are zero, means that round was ended in passes
        if (props.roundScore.card_scores[0] + props.roundScore.card_scores[1] !== 0)
            lastHandPoints[props.roundScore.lastHandTeam] += 10;
        totalRoundPoints[0] = props.roundScore.card_scores[0] + props.roundScore.premium_scores[0] + lastHandPoints[0];
        totalRoundPoints[1] = props.roundScore.card_scores[1] + props.roundScore.premium_scores[1] + lastHandPoints[1];
    }

    return (
        <div>
            <Table className={styles.roundOverTable} hover>
                <tr>
                    <th />
                    <th>{t('roundScoreTable.team1PointsLabel')}</th>
                    <th>{t('roundScoreTable.team2PointsLabel')}</th>
                </tr>
                {props.roundScore.card_scores &&
                    <tr>
                        <th>{t('roundScoreTable.pointsFromCardsLabel')}</th>
                        <td>{props.roundScore.card_scores[0]}</td>
                        <td>{props.roundScore.card_scores[1]}</td>
                    </tr>
                }
                {props.roundScore.premium_scores &&
                    <tr>
                        <th>{t('roundScoreTable.pointsFromPremiumsLabel')}</th>
                        <td>{props.roundScore.premium_scores[0]}</td>
                        <td>{props.roundScore.premium_scores[1]}</td>
                    </tr>
                }
                {props.roundScore.premium_scores &&
                    <tr>
                        <th>{t('roundScoreTable.pointsFromLastHandLabel')}</th>
                        <td>{lastHandPoints[0]}</td>
                        <td>{lastHandPoints[1]}</td>
                    </tr>
                }
                {props.roundScore.premium_scores && props.roundScore.card_scores &&
                    <tr>
                        <th>{t('roundScoreTable.roundPointsSumLabel')}</th>
                        <th>{totalRoundPoints[0]}</th>
                        <th>{totalRoundPoints[1]}</th>
                    </tr>
                }
                {props.gameStatus.teamScores && props.gameStatus.teamLastRoundScores &&
                    <tr>
                        <th>{t('roundScoreTable.gamePointsLabel')}</th>
                        <th>{props.gameStatus.teamScores[0] - props.gameStatus.teamLastRoundScores[0]}</th>
                        <th>{props.gameStatus.teamScores[1] - props.gameStatus.teamLastRoundScores[1]}</th>
                    </tr>
                }
            </Table>
            <p>{t('roundScoreTable.nextRoundTimerLabelPt1')} {secondsLeft} {t('roundScoreTable.nextRoundTimerLabelPt2')}</p>
        </div>
    );

}
export default RoundScoreTable
