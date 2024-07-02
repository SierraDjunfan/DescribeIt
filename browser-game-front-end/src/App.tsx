import React, { useState, useEffect } from 'react'
import { socket } from './socket'
import './App.scss'
import { textIsEmptyOrNull } from './Utilities'
import { PreRoom } from './Components/PreRoom'
import { RoomCode } from './Components/RoomCode'
import toast, { Toaster } from 'react-hot-toast'
import { Teams } from './Components/Teams'
import { Rounds } from './Components/Rounds'
import { StartGamePrompt } from './Components/StartGamePrompt'
import { PreTimerPrompt } from './Components/PreTimerPrompt'
import { NumberOfRounds } from './Components/NumberOfRounds'
import { GameProgress, Turn } from './CustomTypes'
import { Timer } from './Components/Timer'
import { ActiveTimerPrompt } from './Components/ActiveTimerPrompt'
import { EndRoundScore } from './Components/EndRoundScore'
import { EndTimerPrompt } from './Components/EndTimerPrompt'
import { Winner } from './Components/Winner'

interface Room {
  roomCode: string
  teams: { teamOne: string[], teamTwo: string[] }
  host: string
  gameProgress: GameProgress
  currentRound: number
  maxRounds: number
  turns: Turn[]
  currentWord: string
}

const initialGameState: Room = {
  roomCode: "",
  teams: { teamOne: [], teamTwo: [] },
  host: "",
  gameProgress: GameProgress.PreGame,
  currentRound: 1,
  maxRounds: 3,
  turns: [],
  currentWord: ""
}

const App = () => {

  const maxTime = 5

  const [isConnected, setIsConnected] = useState(socket.connected)
  const [gameState, setGameState] = useState(initialGameState)
  const [clientState, setClientState] = useState({ playerName: "", playerNameInput: "", roomCodeInput: "", timerShouldTick: false})
  const [time, setTime] = useState(maxTime)

  useEffect(() => {

    function onConnect() {
      setIsConnected(true)
      console.log("Connected to server.")
    }

    function onDisconnect() {
      setIsConnected(false)
      console.log("Disconnected from server.")
    }

    function onGameStateUpdate(newState: Room) {
      setGameState(newState)
    }

    function onError(errorText: string) {
      showError(errorText, 1500)
    }

    function onNotification(message: string) {
      toast.success(message, {
        duration: 1200,
        className: "clipboard-alert",
        iconTheme: {
          primary: "#24282F",
          secondary: "#96CEC5;"
        }
      })
    }

    function onTimerStarted() {
      setClientState( oldState => ({...oldState, timerShouldTick: true}))
    }

    function onCorrectNotification(message: string) {
      toast.success(message)
    }

    function onSkipNotification(message: string) {
      toast.error(message)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('gameStateUpdated', onGameStateUpdate)
    socket.on('error', onError)
    socket.on('notification', onNotification)
    socket.on(`startTimer`, onTimerStarted)
    socket.on('correct-notification', onCorrectNotification)
    socket.on('skip-notification', onSkipNotification)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('gameStateUpdated', onGameStateUpdate)
      socket.off('error', onError)
      socket.off('notification', onNotification)
      socket.off('startTimer', onTimerStarted)
      socket.off('correct-notification', onCorrectNotification)
      socket.off('skip-notification', onSkipNotification)
    }
  }, [])

  function onHostRoomPressed() {
    if (textIsEmptyOrNull(clientState.playerNameInput)) {
      showError("Please enter a name first", 1300)
      return
    }
    setClientState(oldState => ({ ...oldState, playerName: clientState.playerNameInput }))
    socket.emit('createRoom', clientState.playerNameInput)
  }

  function onJoinRoomPressed() {
    if (textIsEmptyOrNull(clientState.playerNameInput)) {
      showError("Please enter a name first", 1300)
      return
    } else if (textIsEmptyOrNull(clientState.roomCodeInput)) {
      showError("Please enter a room code first", 1300)
      return
    }
    setClientState(oldState => ({ ...oldState, playerName: clientState.playerNameInput }))
    socket.emit('joinRoom', clientState.playerNameInput, clientState.roomCodeInput)
  }

  function onNameInputChanged(text: string) {
    setClientState(oldState => ({ ...oldState, playerNameInput: text }))
  }

  function onRoomCodeInputChanged(text: string) {
    setClientState(oldState => ({ ...oldState, roomCodeInput: text }))
  }

  function showError(text: string, durationInMilliseconds: number) {
    toast.error(text, 
      {
        duration: durationInMilliseconds,
        className: "error-notification"
      }
    )
  }

  function onCopyRoomCodeButtonPressed() {
    navigator.clipboard.writeText(gameState.roomCode)
    toast.success("Copied!", {
      duration: 900,
      className: "clipboard-alert",
      iconTheme: {
        primary: "#24282F",
        secondary: "#96CEC5;"
      }
    })
  }

  function isHost() {
    return clientState.playerName === gameState.host
  }

  function getCurrentTurn() {
    return gameState.turns[gameState.turns.length - 1]
  }

  function isDescriber() {
    return clientState.playerName === getCurrentTurn().describer
  }

  function getTeam() {
    return gameState.teams.teamOne.includes(clientState.playerName) ? gameState.teams.teamOne : gameState.teams.teamTwo
  }

  function onMoveTeamButtonPressed(teamToMoveTo: "Team One" | "Team Two") {

    const newTeam = teamToMoveTo === "Team One" ? gameState.teams.teamOne : gameState.teams.teamTwo

    if (newTeam.includes(clientState.playerName)) {
      return
    }
    socket.emit('changeTeam', gameState.roomCode, clientState.playerName, teamToMoveTo)
  }

  function preRoomProps() {
    return {
      onNameInputChanged: onNameInputChanged,
      onRoomCodeInputChanged: onRoomCodeInputChanged,
      nameInput: clientState.playerNameInput,
      roomCodeInput: clientState.roomCodeInput,
      onHostRoomPressed: onHostRoomPressed,
      onJoinRoomPressed: onJoinRoomPressed
    }
  }

  function onRoundsInputChanged(number: number) {
    socket.emit('maxRoundsChanged', gameState.roomCode, number)
  }

  function roomCodeProps() {
    return {
      roomCode: gameState.roomCode,
      onCopyRoomCodeButtonPressed: onCopyRoomCodeButtonPressed
    }
  }

  function getTeamOfPlayer(playerName: string) {
    return gameState.teams.teamOne.includes(playerName) ? "Team One" : "Team Two"
  }

  function getTotalScoreOfTurn(turn: Turn) {
    const allCorrectWords = turn.guessedWords.length 
    const allSkippedWords = turn.skippedWords.length
    return allCorrectWords - allSkippedWords
  }

  function getScores() {
    const teamOneScore = gameState.turns
    .filter( turn => getTeamOfPlayer(turn.describer) === "Team One")
    .map( turn => getTotalScoreOfTurn(turn)).reduce( (a, c,) => a + c, 0)

    const teamTwoScore = gameState.turns
    .filter( turn => getTeamOfPlayer(turn.describer) === "Team Two")
    .map( turn => getTotalScoreOfTurn(turn)).reduce( (a, c,) => a + c, 0)

    return {
      teamOne: teamOneScore,
      teamTwo: teamTwoScore
    }
  }

  function teamProps() {
    return {
      teamOne: gameState.teams.teamOne,
      teamTwo: gameState.teams.teamTwo,
      buttonsShouldShow: gameState.gameProgress === GameProgress.PreGame,
      onMoveTeamButtonPressed: onMoveTeamButtonPressed,
      teamOneScore: gameState.gameProgress === GameProgress.PreGame ? 0 : getScores().teamOne,
      teamTwoScore: gameState.gameProgress === GameProgress.PreGame ? 0 : getScores().teamTwo
    }
  }

  function roundsProps() {
    return {
      isHost: isHost(),
      maxRounds: gameState.maxRounds,
      onRoundsInputChanged: onRoundsInputChanged
    }
  }

  function onStartGameButtonPressed() {
    socket.emit('startGame', gameState.roomCode)
  }

  function startGamePromptProps() {
    return {
      isHost: isHost(),
      onStartGameButtonPressed: onStartGameButtonPressed
    }
  }

  function preTimerPromptProps() {
    const describer = gameState.turns[gameState.turns.length - 1].describer
    return {
      describer: describer,
      isDescriber: describer === clientState.playerName,
      onReadyButtonPressed: onReadyButtonPressed
    }
  }

  function onReadyButtonPressed() {
    socket.emit('describerReady', gameState.roomCode)
  }

  function numberOfRoundsProps() {
    return {
      currentRound: gameState.currentRound,
      maxRounds: gameState.maxRounds
    }
  }

  function tick() {
    if (time - 1 < 0) {
      setClientState( oldState => ({...oldState, timerShouldTick: false}))
      setTime(maxTime)
      if (isHost()) {
        socket.emit('timerEnded', gameState.roomCode)
      }
    } else {
      setTime( oldTime => oldTime - 1)
    }
  }

  function timerProps() {
    return {
      time: time,
      shouldTick: clientState.timerShouldTick,
      tick: tick
    }
  }

  function activeTimerPromptProps() {

    return {
      onDescriberTeam: getTeam().includes(getCurrentTurn().describer),
      isDescriber: isDescriber(),
      word: gameState.currentWord,
      describer: getCurrentTurn().describer,
      onCorrectButtonPressed: onCorrectButtonPressed,
      onSkipButtonPressed: onSkipButtonPressed
    }
  }

  function onCorrectButtonPressed() {
    socket.emit('correct', gameState.roomCode)
  }

  function onSkipButtonPressed() {
    socket.emit('skip', gameState.roomCode)
  }

  function endRoundScoreProps() {
    const turn = getCurrentTurn()
    return {
      describer: turn.describer,
      isDescriber: isDescriber(),
      roundScore: getTotalScoreOfTurn(turn),
      guessedWords: turn.guessedWords,
      skippedWords: turn.skippedWords
    }
  }

  function endTimerPromptProps() {
    return {
      isHost: isHost(),
      host: gameState.host,
      onContinueButtonPressed: onContinueButtonPressed
    }
  }

  function onContinueButtonPressed() {
    socket.emit('continue', gameState.roomCode)
  }

  function onReplayButtonPressed() {
    socket.emit('restart', gameState.roomCode)
  }

  function winnerProps() {
    const scores = getScores()
    const winner = scores.teamOne > scores.teamTwo ? "Team One" : "Team Two"
    return {
      winner: winner,
      isHost: isHost(),
      onReplayButtonPressed: onReplayButtonPressed
    }
  }

  return (
    <div className="app">
      <div><Toaster /></div>
      <div id="content-main">
        {gameState.roomCode === "" &&
          <>
            <header>
              <h1>Describe it!</h1>
              <p>The team game where communication is key!</p>
            </header>
            <PreRoom {...preRoomProps()} />
          </>}
        {gameState.roomCode !== "" && gameState.gameProgress === GameProgress.PreGame &&
          <>
            <RoomCode {...roomCodeProps()} />
            <Teams {...teamProps()}/>
            <Rounds {...roundsProps()}/>
            <StartGamePrompt {...startGamePromptProps()}/>
          </>
        }
        {gameState.gameProgress === GameProgress.PreTimer && 
        <>
        <Teams {...teamProps()}/>
        <NumberOfRounds {...numberOfRoundsProps()}/>
        <PreTimerPrompt {...preTimerPromptProps()}/>
        </>
        }

        {gameState.gameProgress === GameProgress.TimerActive && <>
        <Teams {...teamProps()}/>
        <NumberOfRounds {...numberOfRoundsProps()}/>
        <Timer {...timerProps()}/>
        <ActiveTimerPrompt {...activeTimerPromptProps()}/>
        </>}

        {gameState.gameProgress === GameProgress.TimerEnded && <>
        <Teams {...teamProps()}/>
        <NumberOfRounds {...numberOfRoundsProps()}/>
        <EndRoundScore {...endRoundScoreProps()}/>
        <EndTimerPrompt {...endTimerPromptProps()}/>
        </>}
        {gameState.gameProgress == GameProgress.GameEnded && <Winner {...winnerProps()}/>}
      </div>
    </div>
  )
}

export default App