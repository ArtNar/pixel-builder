import React from 'react';

export const KEYBOARD_KEYS = {
  escape: 'Escape',
  enter: 'Enter',
} as const;

export type KeyboardKeyType = typeof KEYBOARD_KEYS[keyof typeof KEYBOARD_KEYS];

type UseKeyboardType = {
  onKeyDown?: (key: KeyboardKeyType) => void;
  onEscape?: () => void;
  onEnter?: () => void;
};

export const useKeyboard = ({ onKeyDown, onEscape, onEnter }: UseKeyboardType) => {
  const handleKeyDownAction = React.useCallback(
    (e: KeyboardEvent | React.KeyboardEvent) => {
      const { key } = e;

      if (key === KEYBOARD_KEYS.escape && onEscape) {
        onEscape();
      } else if (key === KEYBOARD_KEYS.enter && onEnter) {
        onEnter();
      } else if (onKeyDown) {
        onKeyDown(key as KeyboardKeyType);
      }
    },
    [onEscape, onEnter, onKeyDown]
  );

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDownAction, false);

    return () => {
      document.removeEventListener('keydown', handleKeyDownAction, false);
    };
  }, [handleKeyDownAction]);
};
