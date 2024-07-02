export {}

// // src/components/Lobby.tsx
// import React from 'react';

// interface LobbyProps {
//     name: string;
//     roomLink: string;
//     handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     handleRoomLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     handleCreateRoom: () => void;
//     handleJoinRoom: () => void;
//     errorMessage: string;
// }

// const Lobby: React.FC<LobbyProps> = ({
//     name,
//     roomLink,
//     handleNameChange,
//     handleRoomLinkChange,
//     handleCreateRoom,
//     handleJoinRoom,
//     errorMessage
// }) => {
//     return (
//         <>
//             <input
//                 type="text"
//                 placeholder="Enter your name"
//                 value={name}
//                 onChange={handleNameChange}
//             />
//             <p>THEN</p>
//             <button onClick={handleCreateRoom}>Host a Room</button>
//             <p>OR</p>
//             <div id="room-id-input-container">
//                 <input
//                     type="text"
//                     placeholder="Enter room ID"
//                     value={roomLink}
//                     onChange={handleRoomLinkChange}
//                 />
//                 <button onClick={handleJoinRoom}>Join Room</button>
//             </div>

//             {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//         </>
//     );
// };

// export default Lobby;
