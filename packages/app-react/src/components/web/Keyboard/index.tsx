import React, { useCallback, useEffect, useRef } from 'react';
import { Key } from '../../../configs/keycodes.config';

type KeyBoardProps = {
  handlers: {
    onEnter?: () => void;
  };
};

const KeyboardHandler: React.FC<KeyBoardProps> = (props) => {
  const divEl = useRef<HTMLDivElement>(null);
  const handleKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      e.stopPropagation();
      switch (e.key) {
        case Key.Enter:
          props.handlers.onEnter && props.handlers.onEnter();
          break;
        default:
          break;
      }
    },
    [props.handlers],
  );

  useEffect(() => {
    if (divEl.current) {
      divEl.current.onkeyup = handleKeyUp;
    }
  }, [divEl.current, handleKeyUp]);

  return <span ref={divEl}>{props.children}</span>;
};

export default KeyboardHandler;
