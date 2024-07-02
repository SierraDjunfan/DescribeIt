interface EndRoundScoreProps {
    describer: string,
    isDescriber: boolean,
    roundScore: number,
    guessedWords: string[],
    skippedWords: string[]
}

export const EndRoundScore = (props: EndRoundScoreProps) => {
    return <>
        <h2>{props.isDescriber ? `You got ${props.roundScore} points!` : `${props.describer} got ${props.roundScore} points!`}</h2>
        <div id="teams-container">
            <div className="team-container">
                <h3>Guessed Words</h3>
                <ul>
                    {props.guessedWords.map(word => <li>{word}</li>)}
                </ul>
            </div>
            <div className="team-container">
                <h3>Skipped Words</h3>
                <ul>
                    {props.skippedWords.map(word => <li>{word}</li>)}
                </ul>
            </div>
        </div>
    </>
}