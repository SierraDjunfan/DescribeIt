//Package Imports
import express from 'express'
import { createServer } from 'node:http'
import cors from 'cors'
import { Server } from 'socket.io'
import { fillArrayWith1, shuffleArray, uniqueRoomCode } from './utilities'
import { GameProgress, Turn } from './customTypes'
import { allWords } from './words'

//Server Setup
const app = express()
const server = createServer(app)
app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 3001

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

interface Room {
    roomCode: string
    teams: { teamOne: string[], teamTwo: string[] }
    host: string
    gameProgress: GameProgress
    currentRound: number
    maxRounds: number
    turns: Turn[],
    currentWord: string
}

export let rooms: Room[] = []

let wordSets: {roomCode: string, fullSet: string[], mutableSet: string[]}[] = []

function newRoomObject(): Room {
    return { 
        roomCode: uniqueRoomCode(),
        teams: { teamOne: [], teamTwo: [] },
        host: "",
        gameProgress: GameProgress.PreGame,
        currentRound: 1,
        maxRounds: 3,
        turns: [],
        currentWord: ""
    }
}

function getRoom(roomCode: string) {
    return rooms.find(room => room.roomCode === roomCode)!
}

function roomExists(roomCode: string) {
    return rooms.some(room => room.roomCode === roomCode);
}

function playerNameAlreadyExistsInRoom(playerName: string, roomCode: string) {
    const room = getRoom(roomCode)!
    return [...room.teams.teamOne, ...room.teams.teamTwo].includes(playerName)
}

function updateAllUsersInRoom(roomCode: string) {
    if (roomExists(roomCode)) {
        const toSend = rooms.find(room => room.roomCode === roomCode)!
        io.to(roomCode).emit('gameStateUpdated', toSend)
        console.log(`Updating all users in room ${roomCode}`)
    } else {
        console.log("Room does not exist.")
    }
}

function sendNotificationToRoom(roomCode: string, message: string) {
    io.to(roomCode).emit('notification', message)
}

function getWordSet(roomCode: string) {
    return wordSets.find(set => set.roomCode === roomCode)!
}

function getANewWord(roomCode: string) {
    let set = getWordSet(roomCode)
    if (set.mutableSet.length === 0) {
        set.mutableSet = shuffleArray(set.fullSet)
        return set.mutableSet.pop()!
    } else {
        return set.mutableSet.pop()!
    }
}

io.on("connection", (socket) => {
    console.log("A user connected")

    socket.on("disconnect", () => {
        console.log("A user disconnected")
    })

    socket.on("createRoom", (playerName: string) => {
        let newRoom = newRoomObject()
        const roomCode = newRoom.roomCode
        newRoom.teams.teamOne = [playerName]
        newRoom.host = playerName
        rooms = [...rooms, newRoom]
        let shuffledWords = shuffleArray(allWords)
        let newWordSet = {roomCode: roomCode, fullSet: shuffledWords, mutableSet: shuffledWords}
        wordSets = [...wordSets, newWordSet]
        socket.join(roomCode)
        updateAllUsersInRoom(roomCode)
    })

    socket.on("joinRoom", (playerName: string, roomCode: string) => {
        console.log(rooms)
        if (!roomExists(roomCode)) {
            socket.emit("error", "Room code does not exist.")
            return
        }
        if (playerNameAlreadyExistsInRoom(playerName, roomCode)) {
            socket.emit("error", "Name already exists in that room. Please enter a unique name.")
            return
        }
        socket.join(roomCode)
        let roomToJoin = getRoom(roomCode)
        if (roomToJoin.teams.teamOne.length > roomToJoin.teams.teamTwo.length) {
            const originalTeam = roomToJoin.teams.teamTwo
            roomToJoin.teams.teamTwo = [...originalTeam, playerName]
        } else {
            const originalTeam = roomToJoin.teams.teamOne
            roomToJoin.teams.teamOne = [...originalTeam, playerName]
        }
        updateAllUsersInRoom(roomCode)
        sendNotificationToRoom(roomCode, `${playerName} joined the room!`)
    })

    socket.on("changeTeam", (roomCode: string, playerName: string, roomToMoveTo: "Team One" | "Team Two") => {
        let room = getRoom(roomCode)
        const teamToRemoveFrom = roomToMoveTo === "Team One" ? room.teams.teamTwo : room.teams.teamOne
        const oldTeamUpdated = teamToRemoveFrom.filter( player => player !== playerName )
        const teamToMoveTo = roomToMoveTo === "Team One" ? room.teams.teamOne : room.teams.teamTwo
        const newTeamUpdated = [...teamToMoveTo, playerName]

        if (roomToMoveTo === "Team One") {
            room.teams.teamOne = newTeamUpdated
            room.teams.teamTwo = oldTeamUpdated
        } else {
            room.teams.teamOne = oldTeamUpdated
            room.teams.teamTwo = newTeamUpdated
        }
        updateAllUsersInRoom(roomCode)
    })

    socket.on("maxRoundsChanged", (roomCode: string, maxRounds: number) => {
        let room = getRoom(roomCode)
        room.maxRounds = maxRounds
        updateAllUsersInRoom(roomCode)
    })

    socket.on("startGame", (roomCode: string) => {
    
        let room = getRoom(roomCode)

        if (room.teams.teamOne.length <2 || room.teams.teamTwo.length < 2) {
            socket.emit("error", "Minimum 2 players per team")
            return
        }

        const firstTurn: Turn = {
            round: 1,
            describer: room.teams.teamOne[0],
            guessedWords: [],
            skippedWords: []
        }
        room.gameProgress = GameProgress.PreTimer
        room.turns = [firstTurn]
        updateAllUsersInRoom(roomCode)
    })

    socket.on("describerReady", (roomCode: string) => {
        let room = getRoom(roomCode)
        const newWord = getANewWord(roomCode)
        room.currentWord = newWord
        room.gameProgress = GameProgress.TimerActive
        updateAllUsersInRoom(roomCode)
        io.to(roomCode).emit('startTimer')
    })

    socket.on("correct", (roomCode: string) => {
        let room = getRoom(roomCode)
        const oldWord = room.currentWord
        room.turns[room.turns.length - 1].guessedWords = [...room.turns[room.turns.length - 1].guessedWords, room.currentWord]
        room.currentWord = getANewWord(roomCode)
        updateAllUsersInRoom(roomCode)
        io.to(roomCode).emit('correct-notification', `${oldWord} was correct!`)
    })

    socket.on("skip", (roomCode: string) => {
        let room = getRoom(roomCode)
        const oldWord = room.currentWord
        room.turns[room.turns.length - 1].skippedWords = [...room.turns[room.turns.length - 1].skippedWords, room.currentWord]
        room.currentWord = getANewWord(roomCode)
        updateAllUsersInRoom(roomCode)
        io.to(roomCode).emit('skip-notification', `${oldWord} was skipped!`)
    })

    socket.on("timerEnded", (roomCode: string) => {
        let room = getRoom(roomCode)
        room.gameProgress = GameProgress.TimerEnded
        updateAllUsersInRoom(roomCode)
    })

    socket.on("continue", (roomCode: string) => {
        console.log("This ran")
        let room = getRoom(roomCode)

        const teamOne = room.teams.teamOne
        const teamTwo = room.teams.teamTwo

        const numberOfPlayersInLargerTeam = teamOne.length > teamTwo.length ? teamOne.length : teamTwo.length
        const turnsPerRound = numberOfPlayersInLargerTeam * 2
        const turnsPerGame = turnsPerRound * room.maxRounds
        const newRoundTurns = fillArrayWith1(room.maxRounds).map( num => num * turnsPerRound)

        if (room.turns.length === turnsPerGame) {
            room.gameProgress = GameProgress.GameEnded
            updateAllUsersInRoom(roomCode)
        } else {

            if (newRoundTurns.includes(room.turns.length)) {
                room.currentRound += 1
            }

            if (room.turns.length === 1) {
                const newDescriber = room.teams.teamTwo[0]
                const newTurn: Turn = {
                    round: room.currentRound,
                    describer: newDescriber,
                    guessedWords: [],
                    skippedWords: []
                }
                room.turns = [...room.turns, newTurn]
                room.gameProgress = GameProgress.PreTimer
                updateAllUsersInRoom(roomCode)
                return
            }

            const lastTurnByNextTeam = room.turns[room.turns.length - 2]
            const lastDescriber = lastTurnByNextTeam.describer
            const newTeam = teamOne.includes(lastDescriber) ? room.teams.teamOne : room.teams.teamTwo
            const indexOfOldDescriber = newTeam.indexOf(lastDescriber)
            const newIndex = indexOfOldDescriber + 1 === newTeam.length ? 0 : indexOfOldDescriber + 1
            const newDescriber = newTeam[newIndex]
            const newTurn: Turn = {
                round: room.currentRound,
                describer: newDescriber,
                guessedWords: [],
                skippedWords: []
            }
            room.turns = [...room.turns, newTurn]
            room.gameProgress = GameProgress.PreTimer
            updateAllUsersInRoom(roomCode)
        }
    })
    socket.on("restart", (roomCode: string) => {
        let room = getRoom(roomCode)
        room.gameProgress = GameProgress.PreGame
        room.currentRound = 1
        room.maxRounds = 3
        room.turns = []
        room.currentWord = ""
        const words = getWordSet(roomCode)
        const reshuffled = shuffleArray(allWords)
        words.fullSet = reshuffled
        words.mutableSet = reshuffled
        updateAllUsersInRoom(roomCode)
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})