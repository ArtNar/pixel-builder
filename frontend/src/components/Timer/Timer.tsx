import React from 'react';
import cn from 'classnames';
import moment from 'moment';
import { secondsToDhms } from '../../helpers/secondsToDhms';
import styles from './Timer.module.scss';

// plurefy
const TIME_PARTS = {
  d: 'day',
  h: 'hour',
  m: 'minute',
  s: 'second',
};

export type TimerType = {
  d?: number;
  h?: number;
  m?: number;
  s?: number;
};

export const TIMER_VARIANTS = {
  small: 'small',
};

type TimerItemType = {
  className?: string;
  children: React.ReactNode;
};

type TimerComponentType = {
  className?: string;
  variant?: string;
  dateFinish?: string;
};

const TimerItem: React.FC<TimerItemType> = ({ children, className }) => {
  return <div className={cn(className)}>{children}</div>;
};

const Timer: React.FC<TimerComponentType> = ({ className, variant, dateFinish: dateFinishString }) => {
  const timerRef = React.useRef(null);
  const [currentDate, setCurrentDate] = React.useState(null);

  const timeConfig = React.useMemo(() => {
    if (!currentDate || !dateFinishString) {
      return null;
    }

    const dateStart = moment(currentDate);
    const dateFinish = moment(dateFinishString);
    const diffSeconds = dateFinish.diff(dateStart) / 1000;

    return secondsToDhms(diffSeconds);
  }, [currentDate, dateFinishString]);

  React.useEffect(() => {
    const handleSetTime = () => {
      setCurrentDate(new Date().toISOString());
    };

    if (dateFinishString) {
      timerRef.current = setInterval(handleSetTime, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [dateFinishString]);

  if (!timeConfig) {
    return null;
  }

  return (
    <div
      className={cn(
        styles.timer,
        {
          [styles.small]: variant === TIMER_VARIANTS.small,
        },
        className
      )}>
      {Object.keys(TIME_PARTS).map((key, idx) => {
        const value = String(timeConfig[key] || 0).padStart(2, '0');

        const showDots = idx > 0;

        return (
          <React.Fragment key={idx}>
            {showDots && <div className={styles.dots}>:</div>}
            <TimerItem className={styles.timerItem}>
              {value}
              <span className={styles.description}>{TIME_PARTS[key]}</span>
            </TimerItem>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Timer;
