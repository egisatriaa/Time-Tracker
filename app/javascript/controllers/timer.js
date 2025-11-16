import { useEffect, useState } from 'react';

const useCountdown = (startTime) => {
  const [countDown, setCountDown] = useState(startTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(prevCountDown => {
        const newCountDown = prevCountDown - 1000;
        return newCountDown >= 0 ? newCountDown : 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
  // calculate time left
  const hours = Math.floor(countDown / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));

  return [hours, minutes];
};

export { useCountdown };
