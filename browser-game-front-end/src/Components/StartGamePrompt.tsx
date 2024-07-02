interface StartGamePromptProps {
    isHost: boolean
    onStartGameButtonPressed: () => void
}

export const StartGamePrompt = (props: StartGamePromptProps) => {
    return <>
    {props.isHost && <button onClick={() => props.onStartGameButtonPressed()}>Start Game</button>}
    {!props.isHost && <p>Waiting for host...</p>}
    </>
}