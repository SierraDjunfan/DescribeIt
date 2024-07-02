export interface Team {
    name: "Team One" | "Team Two"
    players: string[]
    score: number
}

export interface Turn {
    round: number
    describer: string
    guessedWords: string[]
    skippedWords: string[]
}

export enum GameProgress {
    PreGame = "PreGame",
    PreTimer = "PreTimer",
    TimerActive = "TimerActive",
    TimerEnded = "TimerEnded",
    GameEnded = "GameEnded",
  }

export interface GameState {
    teams: Team[]
    maxRounds: number
    gameProgress: GameProgress
    host: string | null
    round: number
    describer: string | null
    currentWord: string | null
    turns: Turn[]
}

export interface Room {
    roomCode: string | null
    gameState: GameState
}