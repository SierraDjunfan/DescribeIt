
export {}
// // src/components/GameInfo.tsx
// import React from 'react';

// interface GameInfoProps {
//   roomId: string;
//   gameState: string;
//   completedRounds: number;
//   rounds: number;
//   getWaitingMessage: () => string;
// }

// const GameInfo: React.FC<GameInfoProps> = ({
//   roomId,
//   gameState,
//   completedRounds,
//   rounds,
//   getWaitingMessage
// }) => {
//   return (
//     <>
//       <h2 id="room-id-label">Room ID: {roomId}</h2>
//       {gameState !== 'PreGame' && (
//         <h3>Round {completedRounds + 1}/{rounds}</h3>
//       )}
//       <p className='waiting-message'>{getWaitingMessage()}</p>
//     </>
//   );
// };

// export default GameInfo;
