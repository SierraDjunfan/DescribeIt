interface WinnerProps {
    winner: string
    isHost: boolean
    onReplayButtonPressed: () => void
}

export const Winner = (props: WinnerProps) => {
    return <>
    <h2>{`${props.winner} wins!!!`}</h2>
    {props.isHost && <button onClick={() => props.onReplayButtonPressed()}>Replay</button>}
    {!props.isHost && <p>Waiting for host to restart...</p>}
    </>
}