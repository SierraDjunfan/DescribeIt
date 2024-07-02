interface RoundsProps {
    isHost: boolean
    maxRounds: number
    onRoundsInputChanged: (number: number) => void
}

export const Rounds = (props: RoundsProps) => {
    return <>
    { props.isHost && <div id="number-of-rounds-container">
        <p>Rounds</p>
        {[1, 2, 3, 4, 5].map( num => <button onClick={ () => props.onRoundsInputChanged(num)}>{num}</button>)}
        </div>}
    {!props.isHost && <p>Rounds: {props.maxRounds}</p>}
    </>
}