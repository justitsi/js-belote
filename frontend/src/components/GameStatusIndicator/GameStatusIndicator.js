import styles from './GameStatusIndicator.module.scss'

function GameStatusIndicator(props) {

    if (props.gameStatus) {
        if (props.gameStatus.teamsValid === true) {
            return (
                <div className={styles.statusContainer}>
                    <table className={styles.gameInfoTable}>
                        <tbody>
                            <tr>
                                <th />
                                <th>{props.gameStatus.teams[0][0]} <br /> {props.gameStatus.teams[0][1]}</th>
                                <th>{props.gameStatus.teams[1][0]} <br /> {props.gameStatus.teams[1][1]}</th>
                            </tr>
                            <tr>
                                <th>Score</th>
                                <td>{props.gameStatus.teamScores[0]}</td>
                                <td>{props.gameStatus.teamScores[1]}</td>
                            </tr>
                            <tr>
                                <th>Round number</th>
                                <td>{props.gameStatus.roundNum}</td>
                            </tr>
                            <tr>
                                <th>Consecutive Passed Games</th>
                                <td>{props.gameStatus.consecutivePasses}</td>
                            </tr>
                            {(props.roundStatus.status == 'in_progress' || props.roundStatus.status == 'suit_selected') &&
                                <tr>
                                    <th>Round Suit</th>
                                    <td>{props.roundStatus.suitInfo.suit}</td>
                                </tr>
                            }
                            {(props.roundStatus.status == 'in_progress' || props.roundStatus.status == 'suit_selected') &&
                                <tr>
                                    <th>Round Suit Caller</th>
                                    <td>{props.roundStatus.suitInfo.caller}</td>
                                </tr>
                            }
                            {props.gameStatus.winningTeam &&
                                <tr>
                                    <th>WINNING TEAM</th>
                                    <td>
                                        {props.gameStatus.teams[props.gameStatus.winningTeam].p1}
                                        {props.gameStatus.teams[props.gameStatus.winningTeam].p2}
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    {/* Belote Page: {JSON.stringify(props.gameStatus)} */}
                </div>
            );
        }
        else return (
            <div>
                Waiting for 4 players to connect
            </div>
        )
    }
    else return (
        <div>
            Connecting...
        </div>
    );
}

export default GameStatusIndicator;