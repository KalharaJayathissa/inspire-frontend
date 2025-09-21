import EducationBackground from "./EducationBackground";
'use client';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PhysicsImg from "../assets/subject/Physics.png";
import ChemistryImg from "../assets/subject/Chemistry.png";
import MathImg from "../assets/subject/Combined_maths.png";  
import Results from "../assets/subject/Results3.jpeg";

const events = [
  {
    title: 'PHYSICS',
    date: 'Sep.25',
    image: PhysicsImg,
    location: 'Kegalle',
  },
  { 
    title: 'COMBINED MATHS',
    date: 'Sep.26',
    image: MathImg,
    location: 'Kegalle',
  },
  {
    title: 'Chemistry',
    date: 'OCT.02',
    image: ChemistryImg,
    location: 'Kegalle',
  },
  {
    title: 'Results Release',
    date: 'Oct.15',
    image: Results,
    location: 'Kegalle',
  },
];

const monthOrder = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Sort events chronologically by month
const sortedEvents = [...events].sort(
  (a, b) => monthOrder.indexOf(a.date) - monthOrder.indexOf(b.date)
);

const Timeline = () => {
  const [activeEvent, setActiveEvent] = useState(null);
  
  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  return (
  <div className="relative w-full min-h-screen bg-lime-30 py-16 px-4 md:px-8 lg:px-16 overflow-hidden border-2 border-green-600 rounded-xl">
    <EducationBackground />
// ...existing code...
      
      {/* Title */}
  <div className="text-center mb-24 relative z-10" data-aos="fade-down">
        <h2 className="text-4xl md:text-5xl font-bold text-green-700">
          EXAM TIMELINE
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-green-400 via-green-600 to-green-400 mx-auto mt-4 shadow-lg shadow-green-500/20"></div>
      </div>
  {/* Central vertical line with neon glow - stop before title, increased gap */}
  <div className="absolute left-1/2 transform -translate-x-1/2 z-10" style={{top: '150px', height: 'calc(100% - 150px)'}}>
        <div className="w-0.5 h-full bg-green-500">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-400 to-green-200 opacity-50 blur-sm"></div>
        </div>
      </div>
      
      {/* Timeline dots with neon effect */}
      {/* <div className="absolute top-32 left-1/2 transform -translate-x-1/2 h-[calc(100%-8rem)] flex flex-col justify-around z-20">
        {sortedEvents.map((_, index) => (
          <div 
            key={index}
            className={`w-4 h-4 rounded-full bg-white border border-green-500 cursor-pointer transform hover:scale-125 transition-transform duration-300 ${
              activeEvent === index ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-white' : ''
            }`}
            style={{
              boxShadow: activeEvent === index ? '0 0 15px 2px rgba(34,197,94,0.7)' : '0 0 10px 1px rgba(34,197,94,0.3)'
            }}
            onClick={() => {
              const element = document.getElementById(`event-${index}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
              setActiveEvent(index);
            }}
          />
        ))}
      </div> */}

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-green-900 border border-yellow-400 text-yellow-400 p-3 rounded-full z-50 shadow-lg shadow-yellow-400/20 transition-all duration-300 transform hover:scale-110 hover:shadow-yellow-400/40"
        style={{ boxShadow: '0 0 15px rgba(54, 251, 36, 0.5)' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

  <div className="space-y-0 lg:space-y-[-5rem] z-20 relative max-w-4xl mx-auto">
        {sortedEvents.map((event, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div
              id={`event-${index}`}
              key={index}
              className={`relative flex items-center w-full ${
                isLeft ? 'justify-start md:justify-end' : 'justify-start'
              }`}
              data-aos={isLeft ? 'fade-right' : 'fade-left'}
            >
              <div className={`w-full max-w-sm sm:max-w-md md:w-6/12 lg:w-5/12 scale-100 ${isLeft ? 'md:mr-3' : 'md:ml-3'} px-3 sm:px-4 md:px-0`} style={{transformOrigin: 'center'}}>
                <div 
                  className="relative bg-green-100 rounded-xl border-2 border-green-700 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 group p-3 sm:p-5 md:p-6 lg:p-8"
                  style={{ boxShadow: '0 4px 16px -8px rgba(0,0,0,0.08)' }}
                >
                  {/* Removed green card glow effect */}
                  <div className="relative z-10">
                    <div className="relative w-full h-48 overflow-hidden">
                      {/* <div className="absolute inset-0 bg-gradient-to-t from-green-900 to-transparent z-10" /> */}
                      <img
                        src={event.image || "/api/placeholder/400/300"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div 
                        className="absolute top-4 left-4 bg-white text-gray-800 font-bold px-3 py-1 rounded-full text-sm z-20 flex items-center border border-gray-300"
                        style={{ boxShadow: '0 0 4px rgba(0,0,0,0.08)' }}
                      >
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {event.date}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-green-900 mb-2 group-hover:text-green-700 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-gray-700 text-sm border border-gray-300 rounded px-2 py-0.5" style={{borderWidth: '1px'}}>
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Connection dot with animated ping effect */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 flex items-center justify-center">
                <div className="absolute w-2 h-2 bg-green-900 rounded-full" style={{ boxShadow: '0 0 10px rgba(20,83,45,0.7)' }}></div>
                <div className="absolute w-4 h-4 bg-green-900/50 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add custom keyframes for animation */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 15s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Timeline;