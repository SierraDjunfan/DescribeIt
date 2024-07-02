interface RoomCodeProps {
    roomCode: string
    onCopyRoomCodeButtonPressed: () => void
}

export const RoomCode = (props: RoomCodeProps) => {
    return <div id="room-code-container">
        <h2>Room Code: {props.roomCode}</h2>
        <button onClick={() => props.onCopyRoomCodeButtonPressed()}>Copy</button>
    </div>
}


