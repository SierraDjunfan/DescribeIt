export {}

// // src/components/Describer.tsx
// import React from 'react';

// interface DescriberProps {
//   currentDescriber: string | null;
//   name: string;
//   handleStartTimer: () => void;
// }

// const Describer: React.FC<DescriberProps> = ({
//   currentDescriber,
//   name,
//   handleStartTimer,
// }) => {
//   return (
//     <>
//       {currentDescriber === name ? (
//         <div className='describer-label-button-container'>
//           <h3>It's your turn to describe!</h3>
//           <button onClick={handleStartTimer}>Ready</button>
//         </div>
//       ) : (
//         <h3>It's {currentDescriber}'s turn to describe.</h3>
//       )}
//     </>
//   );
// };

// export default Describer;