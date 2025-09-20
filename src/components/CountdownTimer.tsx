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
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 4);

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
  <div
    className="flex flex-wrap justify-center items-center 
               gap-4 sm:gap-6 md:gap-8 lg:gap-12"
  >
    {/* Days */}
    <div className="text-center flex-1 min-w-[80px]">
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-primary mb-1 sm:mb-2">
        {formatNumber(timeLeft.days)}
      </div>
      <div className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-white/60 font-light">
        Days
      </div>
    </div>

    {/* Colon */}
    <div className="hidden sm:block text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-primary font-light">:</div>

    {/* Hours */}
    <div className="text-center flex-1 min-w-[80px]">
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-primary mb-1 sm:mb-2">
        {formatNumber(timeLeft.hours)}
      </div>
      <div className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-white/60 font-light">
        Hours
      </div>
    </div>

    {/* Colon */}
    <div className="hidden sm:block text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-primary font-light">:</div>

    {/* Minutes */}
    <div className="text-center flex-1 min-w-[80px]">
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-primary mb-1 sm:mb-2">
        {formatNumber(timeLeft.minutes)}
      </div>
      <div className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-white/60 font-light">
        Minutes
      </div>
    </div>

    {/* Colon */}
    <div className="hidden sm:block text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-primary font-light">:</div>

    {/* Seconds */}
    <div className="text-center flex-1 min-w-[80px]">
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-primary mb-1 sm:mb-2">
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