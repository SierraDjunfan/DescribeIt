interface PreTimerPromptProps {
    describer: string,
    isDescriber: boolean,
    onReadyButtonPressed: () => void
}

export const PreTimerPrompt = (props: PreTimerPromptProps) => {
    return <>
    <h3>{props.isDescriber ? "It's your turn to describe!" : `It's ${props.describer}'s turn to describe!`}</h3>
    {props.isDescriber && <button onClick={() => props.onReadyButtonPressed()}>Ready</button>}
    {!props.isDescriber && <p>{`Waiting for ${props.describer} to ready up...`}</p>}
    </>
}