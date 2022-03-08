import React from 'react';
import Context from './TimerContext';
import { Loader } from '../../components/Loader';
import { secondsToDhms } from '../../helpers/secondsToDhms';

interface ProviderProps {
  children: any;
}

const DEFAULT_TIMER_INTERVAL_MS = 1000 * 60 * 10;

const Provider = ({ children }: ProviderProps) => {
  const timerRef = React.useRef(null);

  const [timerSecondsLeft, setTimerSecondsLeft] = React.useState(null);
  const [timer, setTimer] = React.useState(null);

  const [isLoadingData, setIsLoadingData] = React.useState(true);

  const getTimerData = React.useCallback(async () => {
    // get timer data from server
    const data = await Promise.resolve(10000000);

    return data;
  }, []);

  const handleSetTimerData = React.useCallback(async () => {
    // set user data at server
    const data = await getTimerData();

    setTimerSecondsLeft(data);
  }, [getTimerData]);

  const handleClearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const handleSetTimer = React.useCallback(() => {
    setTimer((prev) => {
      if (prev?.totalSeconds > 0) {
        return secondsToDhms(prev.totalSeconds);
      }

      handleClearTimer();

      return secondsToDhms(prev.totalSeconds);
    });
  }, [handleClearTimer]);

  React.useEffect(() => {
    let timerRequestIntervalId = null;

    if (!timerSecondsLeft && timerRequestIntervalId) {
      clearInterval(timerRequestIntervalId);

      return () => null;
    }

    timerRequestIntervalId = setInterval(handleSetTimerData, DEFAULT_TIMER_INTERVAL_MS);

    return () => {
      if (timerRequestIntervalId) {
        clearInterval(timerRequestIntervalId);
      }
    };
  }, [timerSecondsLeft, handleSetTimerData]);

  React.useEffect(() => {
    const initData = async () => {
      setIsLoadingData(true);

      const timerData = await getTimerData();
      setTimerSecondsLeft(timerData);

      setIsLoadingData(false);
    };

    initData();
  }, [getTimerData]);

  React.useEffect(() => {
    if (typeof timerSecondsLeft === 'number') {
      setTimer(secondsToDhms(timerSecondsLeft));

      timerRef.current = setInterval(handleSetTimer, 1000);
    }

    return () => {
      handleClearTimer();
    };
  }, [timerSecondsLeft, handleSetTimer, handleClearTimer]);

  return (
    <Context.Provider
      value={{
        timerSecondsLeft,
        timer,
        getTimerData,
      }}>
      {isLoadingData ? <Loader /> : children}
    </Context.Provider>
  );
};

export default Provider;
