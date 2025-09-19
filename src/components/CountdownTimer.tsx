import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date to 4 days from now
    const targetDate = new Date("2025-09-21T00:00:00");  //site launch date
    //targetDate.setDate(targetDate.getDate() + 4);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="flex justify-center items-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-12">
      <div className="text-center">
        <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-primary mb-1 sm:mb-2">
          {formatNumber(timeLeft.days)}
        </div>
        <div className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-white/60 font-light">
          Days
        </div>
      </div>
      
      <div className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-primary font-light">:</div>
      
      <div className="text-center">
        <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-primary mb-1 sm:mb-2">
          {formatNumber(timeLeft.hours)}
        </div>
        <div className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-white/60 font-light">
          Hours
        </div>
      </div>
      
      <div className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-primary font-light">:</div>
      
      <div className="text-center">
        <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-primary mb-1 sm:mb-2">
          {formatNumber(timeLeft.minutes)}
        </div>
        <div className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-white/60 font-light">
          Minutes
        </div>
      </div>
      
      <div className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-primary font-light">:</div>
      
      <div className="text-center">
        <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-primary mb-1 sm:mb-2">
          {formatNumber(timeLeft.seconds)}
        </div>
        <div className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-white/60 font-light">
          Seconds
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;