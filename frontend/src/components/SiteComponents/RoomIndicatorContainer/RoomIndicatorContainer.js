import styles from './RoomIndicatorContainer.module.scss';
import RoomIndicator from './../RoomIndicator';
import { Row, Col } from "react-bootstrap"

function RoomIndicatorContainer(props) {
    let content = [];
    if (props.rooms) {
        //sort rooms by number players in them
        const rooms = sortRooms([...props.rooms])

        for (const room of rooms) {
            const roomElement = (
                <Col sm={12} md={6} lg={4} xl={3}>
                    <br />
                    <RoomIndicator
                        players={room.current_players}
                        roomID={room.room_id}
                    />
                </Col >
            );
            content.push(roomElement);
        }
    }

    return (
        <Row>
            {content}
        </Row>
    );
}
export default RoomIndicatorContainer;

const sortRooms = (rooms) => {
    //sort them in descending (reverse) order
    const compareRooms = (room1, room2) => {
        if (room1.current_players.length < room2.current_players.length) return 1;
        if (room1.current_players.length > room2.current_players.length) return -1;
        return 0;
    }

    return rooms.sort(compareRooms)
}

