interface NumberOfRoundsProps {
    currentRound: number,
    maxRounds: number
}

export const NumberOfRounds = (props: NumberOfRoundsProps) => {
    return <>
    <p>{`Round ${props.currentRound}/${props.maxRounds}`}</p>
    </>
}