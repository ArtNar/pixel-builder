import React from 'react';

export type TimerType = {
  d?: number;
  h?: number;
  m?: number;
  s?: number;
};

type ContextValue = {
  timer?: TimerType;
  timerSecondsLeft?: number;
  getTimerData?: () => void;
};

const Context = React.createContext<ContextValue>(null);

export default Context;
