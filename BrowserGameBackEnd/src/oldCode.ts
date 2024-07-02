// //Package Imports
// import express from 'express'
// import { createServer } from 'node:http'
// import cors from 'cors'
// import { Server } from 'socket.io'

// //Internal Imports
// import { GameProgress, GameState, Room } from './customTypes'
// import { generateRoomCode } from './utilities'

// //Server Setup
// const app = express()
// const server = createServer(app)
// app.use(cors())
// app.use(express.json())
// const PORT = process.env.PORT || 3001

// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// })

// //Utility Functions



// function newRoomState(hostName: string): GameState {
//     return {
//         teams: [{
//             name: "Team One",
//             players: [hostName],
//             score: 0
//         }, {
//             name: "Team Two",
//             players: [],
//             score: 0
//         }],
//         maxRounds: 3,
//         gameProgress: GameProgress.PreGame,
//         host: hostName,
//         round: 1,
//         describer: null,
//         currentWord: null,
//         turns: []
//     }
// }

// function roomDataExists(roomCode: string) {
//     return rooms.some(room => room.roomCode === roomCode);
// }

// function getRoomData(roomCode: string) {
//     return rooms.find( room => room.roomCode === roomCode )?.gameState as GameState
// }

// function updateUsers(roomCode: string) {
//     if (roomDataExists(roomCode)) {
//         io.to(roomCode).emit('gameStateUpdate', getRoomData(roomCode))
//         console.log(`Updating all users in room ${roomCode}`)
//     }
// }

// //Server State

// let rooms: Room[] = []

// //Client-Server Interactions

// io.on("connection", (socket) => {

//     console.log("A user connected")
//     socket.on('disconnect', () => {
//         console.log('A user disconnected')
//       })

//     //For Debugging (Can Remove)
//     socket.onAny((eventName, ...args) => {
//         console.log(eventName)
//         console.log(args)
//       });
    
//     //User creates and joins a new room
//     socket.on('createRoom', (playerName: string) => {

//         if (!playerName) {
//             socket.emit('error', 'Player name is required to create a room.')
//             return
//         }

//         const newRoomCode = uniqueRoomCode()
//         let newRoomData: GameState = newRoomState(playerName)
//         const newRoom: Room = { roomCode: newRoomCode, gameState: newRoomData }
//         rooms = [...rooms, newRoom]
//         socket.join(newRoomCode)
//         console.log(`A new user created and joined room: ${newRoomCode} as the host.`)
//         socket.emit('roomCode', newRoomCode)
//         updateUsers(newRoomCode)
//     })

//     // User joins a room
//     socket.on('joinRoom', (roomCode: string, playerName: string) => {

//         if (!playerName) {
//             socket.emit('error', 'Player name is required to join a room.')
//             return
//         }

//         if (roomDataExists(roomCode)) {
//         let gameData = getRoomData(roomCode)
//         socket.join(roomCode)
//         console.log(`A new user joined room: ${roomCode}`)
//         const teamIndex = gameData.teams[0].players.length > gameData.teams[1].players.length ? 1 : 0
//         gameData.teams[teamIndex].players = [...gameData.teams[teamIndex].players, playerName]
//         rooms.find( room => room.roomCode === roomCode )!.gameState = gameData
//         updateUsers(roomCode)
//         } else {
//             socket.emit('error', 'Room does not exist.')
//         }
//     })
// })

//Start Server
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   })

// ________________________________________

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);
  
//     // Join a room
//     socket.on('joinRoom', (roomCode) => {
//       socket.join(roomCode);
//       console.log(`User ${socket.id} joined room: ${roomCode}`);
  
//       // Send the current game state to the newly connected client
//       if (rooms[roomCode]) {
//         socket.emit('gameStateUpdate', rooms[roomCode]);
//       } else {
//         // Initialize room state if it doesn't exist
//         rooms[roomCode] = { team1Score: 0, team2Score: 0 };
//       }
//     });

// socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });



// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);
  
//     // Join a room
//     socket.on('joinRoom', (roomCode) => {
//       socket.join(roomCode);
//       console.log(`User ${socket.id} joined room: ${roomCode}`);
  
//       // Send the current game state to the newly connected client
//       if (rooms[roomCode]) {
//         socket.emit('gameStateUpdate', rooms[roomCode]);
//       } else {
//         // Initialize room state if it doesn't exist
//         rooms[roomCode] = { team1Score: 0, team2Score: 0 };
//       }
//     });

// socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });





// // Create Room Endpoint
// app.post('/create-room', (req, res) => {
//   const { playerName } = req.body;

//   // Validate player name
//   if (!playerName || playerName.trim() === '') {
//     return res.status(400).json({ message: 'Player name cannot be empty' });
//   }

//   let roomId: string;
//   do {
//     roomId = generateRoomId();
//   } while (rooms.find(r => r.id === roomId));

//   rooms.push({
//     id: roomId,
//     host: playerName,
//     players: [{ name: playerName, team: 1 }],
//     gameStarted: false,
//     currentDescriber: null,
//     turnOrder: { teamOne: [playerName], teamTwo: [] },
//     teamOneIndex: 0,
//     teamTwoIndex: 0,
//     teamOneTurns: 0,
//     teamTwoTurns: 0,
//     timer: 0,
//     scores: { teamOne: 0, teamTwo: 0 },
//     individualScores: {},
//     words: generateRandomWords(),
//     usedWords: [],
//     currentWord: null,
//     isReady: false,
//     totalRounds: 3,  // Default number of rounds
//     completedRounds: 0
//   });
//   res.status(201).json({ roomId });
// });




// interface Player {
//   name: string;
//   team: number | null;
// }

// interface Room {
//   id: string;
//   host: string;
//   players: Player[];
//   gameStarted: boolean;
//   currentDescriber: string | null;
//   turnOrder: { teamOne: string[], teamTwo: string[] };
//   teamOneIndex: number;
//   teamTwoIndex: number;
//   teamOneTurns: number;
//   teamTwoTurns: number;
//   timer: number;
//   scores: { teamOne: number, teamTwo: number };
//   individualScores: { [key: string]: number };
//   words: string[];
//   usedWords: string[];
//   currentWord: string | null;
//   isReady: boolean;
//   totalRounds: number;
//   completedRounds: number;
// }

// const rooms: Room[] = [];

// const generateRandomWords = (): string[] => {
//   return [
//     "apple",
//     "banana",
//     "cat",
//     "dog",
//     "elephant",
//     "flower",
//     "guitar",
//     "house",
//     "ice cream",
//     "jungle"
//   ];
// };

// // Function to generate a unique 6-character alphanumeric ID with uppercase letters only
// const generateRoomId = (): string => {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   let roomId = '';
//   for (let i = 0; i < 6; i++) {
//     roomId += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return roomId;
// };

// // Create HTTP server and WebSocket server
// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });

// // Broadcast function to send data to all clients in a room
// const broadcast = (roomId: string, data: any) => {
//   io.to(roomId).emit('update', data);
// };

// // Function to get the next word
// const getNextWord = (room: Room): string | null => {
//   if (room.words.length === 0) {
//     room.words = [...room.usedWords];
//     room.usedWords = [];
//   }
//   const nextWord = room.words.pop() || null;
//   if (nextWord) {
//     room.usedWords.push(nextWord);
//   }
//   return nextWord;
// };

// // Function to handle timer countdown
// const startTimerCountdown = (roomId: string, duration: number) => {
//   const room = rooms.find(r => r.id === roomId);
//   if (!room) return;

//   room.timer = duration;
//   room.individualScores[room.currentDescriber || ''] = 0; // Reset the individual score for the current describer

//   const interval = setInterval(() => {
//     room.timer -= 1;
//     io.to(roomId).emit('timer-update', { timer: room.timer });

//     if (room.timer <= 0) {
//       clearInterval(interval);
//       io.to(roomId).emit('timer-end', { scores: room.scores, describer: room.currentDescriber, individualScore: room.individualScores[room.currentDescriber || ''] });
//     }
//   }, 1000);
// };

// // Create Room Endpoint
// app.post('/create-room', (req, res) => {
//   const { playerName } = req.body;

//   // Validate player name
//   if (!playerName || playerName.trim() === '') {
//     return res.status(400).json({ message: 'Player name cannot be empty' });
//   }

//   let roomId: string;
//   do {
//     roomId = generateRoomId();
//   } while (rooms.find(r => r.id === roomId));

//   rooms.push({
//     id: roomId,
//     host: playerName,
//     players: [{ name: playerName, team: 1 }],
//     gameStarted: false,
//     currentDescriber: null,
//     turnOrder: { teamOne: [playerName], teamTwo: [] },
//     teamOneIndex: 0,
//     teamTwoIndex: 0,
//     teamOneTurns: 0,
//     teamTwoTurns: 0,
//     timer: 0,
//     scores: { teamOne: 0, teamTwo: 0 },
//     individualScores: {},
//     words: generateRandomWords(),
//     usedWords: [],
//     currentWord: null,
//     isReady: false,
//     totalRounds: 3,  // Default number of rounds
//     completedRounds: 0
//   });
//   res.status(201).json({ roomId });
// });

// // Join Room Endpoint
// app.post('/join-room', (req, res) => {
//   const { roomId, playerName } = req.body;

//   // Validate player name
//   if (!playerName || playerName.trim() === '') {
//     return res.status(400).json({ message: 'Player name cannot be empty' });
//   }

//   const room = rooms.find(r => r.id === roomId);

//   if (!room) {
//     return res.status(404).json({ message: 'Room not found' });
//   }

//   // Check if the player name is already taken in the room
//   if (room.players.find(p => p.name === playerName)) {
//     return res.status(400).json({ message: 'Player name is already taken' });
//   }

//   // Automatically assign the player to the team with fewer players
//   const teamOneCount = room.players.filter(p => p.team === 1).length;
//   const teamTwoCount = room.players.filter(p => p.team === 2).length;
//   const team = teamOneCount <= teamTwoCount ? 1 : 2;

//   room.players.push({ name: playerName, team });
//   if (team === 1) {
//     room.turnOrder.teamOne.push(playerName);
//   } else {
//     room.turnOrder.teamTwo.push(playerName);
//   }
//   broadcast(roomId, { type: 'update', players: room.players });
//   res.status(200).json({ message: 'Joined room', roomId });
// });

// // Move Player to Team Endpoint
// app.post('/move-to-team', (req, res) => {
//   const { roomId, playerName, team } = req.body;

//   const room = rooms.find(r => r.id === roomId);
//   if (!room) {
//     return res.status(404).json({ message: 'Room not found' });
//   }

//   const player = room.players.find(p => p.name === playerName);
//   if (!player) {
//     return res.status(404).json({ message: 'Player not found in the room' });
//   }

//   const currentTeam = player.team;

//   player.team = team;

//   // Update turn order
//   if (currentTeam !== team) {
//     if (currentTeam === 1) {
//       room.turnOrder.teamOne = room.turnOrder.teamOne.filter(name => name !== playerName);
//       room.turnOrder.teamTwo.push(playerName);
//     } else {
//       room.turnOrder.teamTwo = room.turnOrder.teamTwo.filter(name => name !== playerName);
//       room.turnOrder.teamOne.push(playerName);
//     }
//   }

//   broadcast(roomId, { type: 'update', players: room.players });
//   res.status(200).json({ message: `Player ${playerName} moved to team ${team}`, roomId });
// });

// // Get Room Endpoint
// app.get('/room/:roomId', (req, res) => {
//   const { roomId } = req.params;
//   const room = rooms.find(r => r.id === roomId);
//   if (!room) {
//     return res.status(404).json({ message: 'Room not found' });
//   }
//   res.status(200).json(room);
// });

// // Set Rounds Endpoint
// app.post('/set-rounds', (req, res) => {
//   const { roomId, rounds } = req.body;

//   const room = rooms.find(r => r.id === roomId);
//   if (!room) {
//     return res.status(404).json({ message: 'Room not found' });
//   }

//   room.totalRounds = rounds;
//   io.to(roomId).emit('rounds-set', { rounds });
//   res.status(200).json({ message: `Total rounds set to ${rounds}`, rounds });
// });

// // Start Game Endpoint
// app.post('/start-game', (req, res) => {
//   const { roomId, playerName } = req.body;

//   const room = rooms.find(r => r.id === roomId);
//   if (!room) {
//     return res.status(404).json({ message: 'Room not found' });
//   }

//   if (room.host !== playerName) {
//     return res.status(403).json({ message: 'Only the host can start the game' });
//   }

//   const teamOneCount = room.players.filter(p => p.team === 1).length;
//   const teamTwoCount = room.players.filter(p => p.team === 2).length;

//   if (teamOneCount < 2 || teamTwoCount < 2) {
//     return res.status(400).json({ message: 'Each team must have at least two players to start the game' });
//   }

//   // Select the first describer from Team One
//   room.teamOneIndex = 0;
//   room.teamTwoIndex = 0;
//   room.teamOneTurns = 0;
//   room.teamTwoTurns = 0;
//   const firstDescriber = room.turnOrder.teamOne[room.teamOneIndex];
//   room.currentDescriber = firstDescriber;

//   room.gameStarted = true;
//   io.to(roomId).emit('game-started', { players: room.players, describer: firstDescriber, rounds: room.totalRounds });
//   res.status(200).json({ message: 'Game started', describer: firstDescriber });
// });

// // Start Timer Endpoint
// app.post('/start-timer', (req, res) => {
//   const { roomId, timer } = req.body;

//   const room = rooms.find(r => r.id === roomId);
//   if (!room) {
//     return res.status(404).json({ message: 'Room not found' });
//   }

//   room.timer = timer;
//   room.isReady = true;
//   room.currentWord = getNextWord(room);

//   io.to(roomId).emit('timer-started', { timer: timer, word: room.currentWord });
//   io.to(roomId).emit('describer-ready', { isReady: room.isReady });

//   startTimerCountdown(roomId, timer);
//   res.status(200).json({ message: 'Timer started', timer: timer, word: room.currentWord });
// });

// // Handle Correct and Skip Endpoint
// app.post('/handle-word', (req, res) => {
//   const { roomId, action } = req.body;

//   const room = rooms.find(r => r.id === roomId);
//   if (!room) {
//     return res.status(404).json({ message: 'Room not found' });
//   }

//   const describer = room.currentDescriber || '';

//   if (action === 'correct') {
//     if (room.currentDescriber && room.players.find(p => p.name === room.currentDescriber)?.team === 1) {
//       room.scores.teamOne += 1;
//     } else {
//       room.scores.teamTwo += 1;
//     }
//     room.individualScores[describer] = (room.individualScores[describer] || 0) + 1;
//   } else if (action === 'skip') {
//     if (room.currentDescriber && room.players.find(p => p.name === room.currentDescriber)?.team === 1) {
//       room.scores.teamOne -= 1;
//     } else {
//       room.scores.teamTwo -= 1;
//     }
//     room.individualScores[describer] = (room.individualScores[describer] || 0) - 1;
//   }

//   room.currentWord = getNextWord(room);
//   io.to(roomId).emit('score-updated', { scores: room.scores });
//   io.to(roomId).emit('new-word', { word: room.currentWord });
//   res.status(200).json({ message: `Word ${action} handled`, scores: room.scores, word: room.currentWord });
// });

// // Next Round Endpoint
// app.post('/next-round', (req, res) => {
//   const { roomId } = req.body;

//   const room = rooms.find(r => r.id === roomId);
//   if (!room) {
//     return res.status(404).json({ message: 'Room not found' });
//   }

//   const currentDescriberTeam = room.players.find(p => p.name === room.currentDescriber)?.team;

//   // Determine next describer based on the current describer team
//   if (currentDescriberTeam === 1) {
//     room.teamOneIndex = (room.teamOneIndex + 1) % room.turnOrder.teamOne.length;
//     room.teamOneTurns += 1;
//     room.currentDescriber = room.turnOrder.teamTwo[room.teamTwoIndex];
//   } else {
//     room.teamTwoIndex = (room.teamTwoIndex + 1) % room.turnOrder.teamTwo.length;
//     room.teamTwoTurns += 1;
//     room.currentDescriber = room.turnOrder.teamOne[room.teamOneIndex];
//   }

//   const totalTeamOneTurns = Math.ceil(room.teamTwoTurns / room.turnOrder.teamTwo.length) * room.turnOrder.teamOne.length;
//   const totalTeamTwoTurns = Math.ceil(room.teamOneTurns / room.turnOrder.teamOne.length) * room.turnOrder.teamTwo.length;

//   // Check if a full round is completed
//   if (room.teamOneTurns >= totalTeamOneTurns && room.teamTwoTurns >= totalTeamTwoTurns) {
//     room.completedRounds += 1;
//     room.teamOneTurns = 0;
//     room.teamTwoTurns = 0;
//   }

//   if (room.completedRounds >= room.totalRounds) {
//     const winner = room.scores.teamOne > room.scores.teamTwo ? 'Team One' : 'Team Two';
//     io.to(roomId).emit('game-over', { winner });
//     res.status(200).json({ message: 'Game over', winner });
//   } else {
//     room.timer = 0;
//     room.isReady = false;
//     room.currentWord = null;

//     io.to(roomId).emit('next-round', { describer: room.currentDescriber });
//     res.status(200).json({ message: 'Next round started', describer: room.currentDescriber });
//   }
// });

// io.on('connection', (socket) => {
//   socket.on('join', (roomId) => {
//     socket.join(roomId);
//   });

//   socket.on('disconnect', () => {
//     // Handle disconnection logic if needed
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


// ______________________________

// 


// app.post('/create-room', (req, res) => {
//     const { playerName } = req.body
//     const roomCode = uniqueRoomCode()
//     const newRoomData = newRoomState(playerName)
//     rooms = [...rooms, {roomCode: roomCode, gameState: newRoomData}]
//     res.status(201).json({ roomCode });
//     updateUsers(roomCode)
// })

// io.on('connection', (socket) => {




// })
