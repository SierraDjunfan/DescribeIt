interface ActiveTimerPromptProps {
    onDescriberTeam: boolean
    isDescriber: boolean
    word: string
    describer: string
    onCorrectButtonPressed: () => void
    onSkipButtonPressed: () => void
}

export const ActiveTimerPrompt = (props: ActiveTimerPromptProps) => {
    return <>
        <h2>{props.isDescriber ? `You are describing ${props.word}!` : props.onDescriberTeam ? `Try to guess what ${props.describer} is describing!` : `${props.describer} is describing ${props.word}`}</h2>
        {props.isDescriber && <div id="describer-buttons-container">
            <button onClick={() => props.onCorrectButtonPressed()}>Correct</button>
            <button onClick={() => props.onSkipButtonPressed()}>Skip</button>
            </div>}
    </>
}