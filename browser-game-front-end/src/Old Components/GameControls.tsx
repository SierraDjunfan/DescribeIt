
export {}
// // src/components/GameControls.tsx
// import React from 'react';

// interface GameControlsProps {
//   gameState: string;
//   currentDescriber: string | null;
//   name: string;
//   isReady: boolean;
//   handleStartTimer: () => void;
//   handleWordAction: (action: 'correct' | 'skip') => void;
//   endMessage: string | null;
//   showNextButton: boolean;
//   handleNextRound: () => void;
//   timer: number;
//   currentWord: string | null;
//   team: number | null;
//   players: { name: string, team: number | null }[];
// }

// const GameControls: React.FC<GameControlsProps> = ({
//   gameState,
//   currentDescriber,
//   name,
//   isReady,
//   handleStartTimer,
//   handleWordAction,
//   endMessage,
//   showNextButton,
//   handleNextRound,
//   timer,
//   currentWord,
//   team,
//   players
// }) => {
//   return (
//     <>
//       {gameState === 'Describing' && (
//         <>
//           <h4 className='timer'>Timer: {timer}</h4>
//           {currentDescriber === name ? (
//             <div>
//               <h3>You are describing: {currentWord}!</h3>
//               <div>
//                 <button onClick={() => handleWordAction('correct')}>Correct</button>
//                 <button onClick={() => handleWordAction('skip')}>Skip</button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {team === players.find(p => p.name === currentDescriber)?.team ? (
//                 <h3>Try to guess what {currentDescriber} is describing!</h3>
//               ) : (
//                 <h3>{currentDescriber} is describing: {currentWord}!</h3>
//               )}
//             </>
//           )}
//         </>
//       )}
//       {endMessage && <h3>{endMessage}</h3>}
//       {showNextButton && <button onClick={handleNextRound}>Next</button>}
//     </>
//   );
// };

// export default GameControls;
