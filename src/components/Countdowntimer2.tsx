// import React, { useEffect, useState } from "react";

// const Countdowntimer2 = () => {
//   // Target date → 25th Sept 8:00 AM
//   const targetDate = new Date("2025-09-25T08:00:00").getTime();

//   const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

//   function getTimeRemaining() {
//     const now = new Date().getTime();
//     const difference = targetDate - now;

//     if (difference <= 0) {
//       return { days: 0, hours: 0, minutes: 0, seconds: 0 };
//     }

//     return {
//       days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//       hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//       minutes: Math.floor((difference / (1000 * 60)) % 60),
//       seconds: Math.floor((difference / 1000) % 60),
//     };
//   }

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft(getTimeRemaining());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     // <div className="grid grid-cols-4 gap-4 text-center">
//     //   {Object.entries(timeLeft).map(([unit, value]) => (
//     //     <div
//     //       key={unit}
//     //       className="bg-gradient-to-br from-blue-500 to-green-500 text-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300"
//     //     >
//     //       <div className="text-4xl font-bold">{value}</div>
//     //       <div className="uppercase text-sm tracking-wide">{unit}</div>
//     //     </div>
//     //   ))}
//     // </div>
//         <div className="grid grid-cols-4 gap-6 text-center">
//     {Object.entries(timeLeft).map(([unit, value]) => (
//         <div
//         key={unit}
//         className="bg-gradient-to-br from-blue-500 to-green-500 text-white rounded-xl p-6 shadow-md"
//         >
//         <div className="text-5xl font-extrabold">{value}</div>
//         <div className="uppercase text-sm tracking-widest opacity-80">{unit}</div>
//         </div>
//     ))}
//     </div>

// //     <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto">
// //     <div className="grid grid-cols-4 gap-6 text-center">
// //       {Object.entries(timeLeft).map(([unit, value]) => (
// //         <div
// //           key={unit}
// //           className="bg-gradient-to-br from-blue-500 to-green-500 text-white rounded-xl p-6 shadow-md"
// //         >
// //           <div className="text-5xl font-extrabold">{value}</div>
// //           <div className="uppercase text-sm tracking-widest opacity-80">{unit}</div>
// //         </div>
// //       ))}
// //     </div>
// //   </div>

//   );
// };

// export default Countdowntimer2;
// Countdowntimer2.tsx
// import React from "react";
// import FlipClockCountdown from "react-flip-clock-countdown";
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import './flipclock.css';


const Countdowntimer2: React.FC = () => {
  // Target: 25th Sept 2025, 8:00 AM
  const targetDate = new Date("2025-09-25T08:00:00").getTime();

  return (
    <div className="flex justify-center items-center py-6">
      <FlipClockCountdown
        to={targetDate}
        className="gap-10"
        labels={["DAYS", "HOURS", "MINUTES", "SECONDS"]}
        labelStyle={{
          fontSize: 28,
          fontWeight: 1000,
          textTransform: "uppercase",
          color: "#247739ff", // gray-700
        }}
        digitBlockStyle={{
          background: "#283f25ff", // gray-100
          color: "#69a569ff", // gray-800
          fontSize: 38,
          width:60,
          borderRadius: "12px",
          boxShadow: "0 18px 10px rgba(247, 30, 30, 0.1)",
        }}
        dividerStyle={{ color: "#6b8074ff" }} // gray-500
      />
    </div>
  );
};

export default Countdowntimer2;
