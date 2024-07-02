interface PreRoomProps {
    onNameInputChanged: (text: string) => void
    onRoomCodeInputChanged: (text: string) => void
    nameInput: string
    roomCodeInput: string
    onHostRoomPressed: () => void
    onJoinRoomPressed: () => void
}

export const PreRoom = (props: PreRoomProps) => {

    function handleKeyPressOnNameInput(key: string) {
        if (key === "Enter" && props.roomCodeInput == "") {
            props.onHostRoomPressed()
        } else if (key === "Enter" && props.roomCodeInput !== "") {
            props.onJoinRoomPressed()
        }
    }

    function handleKeyPressOnRoomCodeInput(key: string) {
        if (key === "Enter") {
            props.onJoinRoomPressed()
        }
    }

    return <>
        <input type="text" placeholder="Enter Name" value={props.nameInput} onChange={e => props.onNameInputChanged(e.target.value)} onKeyDown={ e => handleKeyPressOnNameInput(e.key)} />
        <p>then</p>
        <button onClick={props.onHostRoomPressed}>Host a Room</button>
        <p>or</p>
        <input type="text" placeholder="Enter Room Code" value={props.roomCodeInput} onChange={e => props.onRoomCodeInputChanged(e.target.value)} onKeyDown={ e => handleKeyPressOnRoomCodeInput(e.key)}/>
        <p>and</p>
        <button onClick={props.onJoinRoomPressed}>Join a Room</button>
      </>
}