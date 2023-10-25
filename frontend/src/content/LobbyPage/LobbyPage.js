import styles from './LobbyPage.module.scss';
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext, GameSettingsContext } from '../../modules/socketContexts';
import GameUsernamePrompt from './../../components/SiteComponents/GameUsernamePrompt';
import { log } from '../../modules/util';


const LobbyPage = (props) => {
    // get server contexts
    const [serverId, serverSocketRef] = useContext(SocketContext);
    const [gameName, setGameName, gameRoomId, setGameRoomId] = useContext(GameSettingsContext);

    // setup page variables
    const { roomID } = useParams();
    const [displayName, setDisplayName] = useState(gameName);
    const [usernameAvailable, setUsernameAvailable] = useState(false)
    const [spaceInGameRoom, setSpaceInGameRoom] = useState(false)
    const [error, setError] = useState("");

    // get navigation hook
    const navigate = useNavigate();

    //connect to server to check if room has space to join
    useEffect(() => {
        serverSocketRef.on("doesRoomHaveCapacity", (args) => {
            setSpaceInGameRoom(args)
            if (args === false) setError('Room is full')
            else setError(null)
        });
        serverSocketRef.on("isUsernameAvailable", (args) => {
            setUsernameAvailable(args)
            if (args === false) {
                setError('Username taken');
            }
            else setError(null)
        });

        // emit event to check default name
        serverSocketRef.emit('doesRoomHaveCapacity', roomID)
        serverSocketRef.emit('isUsernameAvailable', { roomID: roomID, displayName: displayName })
        return () => {
            serverSocketRef.off("isUsernameAvailable");
            serverSocketRef.off("doesRoomHaveCapacity");
        }
    }, [roomID, serverId, serverSocketRef]);


    const handleReadyToConnect = () => {
        // update global game context so that info can reach BelotePage component
        setGameName(displayName);
        setGameRoomId(roomID);

        log("debug", `Joining room "${roomID}" with name "${displayName}"`)
        navigate(`/belote/game/${roomID}`)
    }

    const connected = (serverId) && serverSocketRef !== undefined;
    return (
        <div>
            {connected &&
                <GameUsernamePrompt
                    roomID={roomID}
                    displayName={displayName}
                    setDisplayName={setDisplayName}
                    handleReadyToConnect={handleReadyToConnect}
                    // websocket reuse
                    clientID={serverId}
                    socketConn={serverSocketRef}
                    // error handling
                    usernameAvailable={usernameAvailable}
                    spaceInGameRoom={spaceInGameRoom}
                    error={error}
                />
            }
            {!connected &&
                <div>
                    Connecting to server...
                </div>
            }
        </div>
    )
}
export default LobbyPage;