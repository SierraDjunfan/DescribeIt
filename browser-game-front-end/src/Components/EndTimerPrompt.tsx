interface EndTimerPromptProps {
    isHost: boolean
    host: string
    onContinueButtonPressed: () => void
}

export const EndTimerPrompt = (props: EndTimerPromptProps) => {
    return <>
        {!props.isHost && <p>{`Waiting for ${props.host} to continue...`}</p>}
        {props.isHost && <button onClick={() => props.onContinueButtonPressed()}>Continue</button>}
    </>
}