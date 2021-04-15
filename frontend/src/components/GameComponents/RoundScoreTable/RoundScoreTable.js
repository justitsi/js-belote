import styles from './RoundScoreTable.module.scss'
import { useState, useEffect } from 'react'

function RoundScoreTable(props) {
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
        lastHandPoints[props.roundScore.lastHandTeam] += 10;
        totalRoundPoints[0] = props.roundScore.card_scores[0] + props.roundScore.premium_scores[0] + lastHandPoints[0];
        totalRoundPoints[1] = props.roundScore.card_scores[1] + props.roundScore.premium_scores[1] + lastHandPoints[1];
    }

    return (
        <div>
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
                {props.roundScore.premium_scores &&
                    <tr>
                        <th>Points from getting last hand</th>
                        <td>{lastHandPoints[0]}</td>
                        <td>{lastHandPoints[1]}</td>
                    </tr>
                }
                {props.roundScore.premium_scores && props.roundScore.card_scores &&
                    <tr>
                        <th>Round Points Scores</th>
                        <th>{totalRoundPoints[0]}</th>
                        <th>{totalRoundPoints[1]}</th>
                    </tr>
                }
                {props.gameStatus.teamScores && props.gameStatus.teamLastRoundScores &&
                    <tr>
                        <th>Game Points Scores</th>
                        <th>{props.gameStatus.teamScores[0] - props.gameStatus.teamLastRoundScores[0]}</th>
                        <th>{props.gameStatus.teamScores[1] - props.gameStatus.teamLastRoundScores[1]}</th>
                    </tr>
                }
            </table>
            <p>Next round will start in {secondsLeft} secs</p>
        </div>
    );

}
export default RoundScoreTable
