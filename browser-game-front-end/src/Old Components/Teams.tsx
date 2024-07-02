export {}

// // src/components/Teams.tsx
// import React from 'react';

// interface TeamsProps {
//   teamOnePlayers: { name: string, team: number | null }[];
//   teamTwoPlayers: { name: string, team: number | null }[];
//   scores: { teamOne: number, teamTwo: number };
//   name: string;
//   gameState: string;
// }

// const Teams: React.FC<TeamsProps> = ({
//   teamOnePlayers,
//   teamTwoPlayers,
//   scores,
//   name,
//   gameState
// }) => {
//   return (
//     <div id="teams-container">
//       <div className="team-container">
        
//         <div className='team-label-container'>
//             <h3 className='team-label'>Team One</h3>
//             {gameState !== 'PreGame' && <h4 className='score-label'>- {scores.teamOne}</h4>}
//         </div>
//         <ul>
//           {teamOnePlayers.map(player => (
//             <li key={player.name} style={{ color: player.name === name ? 'white' : 'white' }}>
//               {player.name}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className='team-container'>
//         <div className='team-label-container'>
//             <h3 className='team-label'>Team Two</h3>
//             {gameState !== 'PreGame' && <h4 className='score-label'>- {scores.teamTwo}</h4>}
//         </div>
//         <ul>
//           {teamTwoPlayers.map(player => (
//             <li key={player.name} style={{ color: player.name === name ? 'white' : 'white' }}>
//               {player.name}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Teams;
