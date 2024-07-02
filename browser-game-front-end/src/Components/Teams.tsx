interface TeamsProps {
    teamOne: string[]
    teamTwo: string[]
    buttonsShouldShow: boolean
    onMoveTeamButtonPressed: (teamToMoveTo: "Team One" | "Team Two") => void
    teamOneScore: number
    teamTwoScore: number
}

export const Teams = (props: TeamsProps) => {
    return <>
        {props.buttonsShouldShow &&
            <div id="move-team-buttons-container">
                <button onClick={() => props.onMoveTeamButtonPressed("Team One")}>Join Team 1</button>
                <button onClick={() => props.onMoveTeamButtonPressed("Team Two")}>Join Team 2</button>
            </div>}

        <div id="teams-container">
            {[props.teamOne, props.teamTwo].map((team, i) =>
                <div className="team-container">
                    <div className="team-label-container">
                        <h3 className='team-label'>{i === 0 ? "Team One" : "Team Two"}</h3>
                        {!props.buttonsShouldShow && <h2>{i === 0 ? `- ${props.teamOneScore}` : `- ${props.teamTwoScore}`}</h2>}
                    </div>
                    <ul>
                        {team.map(player => <li>{player}</li>)}
                    </ul>
                </div>
            )}
        </div>
    </>
}