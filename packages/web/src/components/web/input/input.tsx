import React, { useEffect, useRef } from 'react';
import KeyboardHandler from '../keyboard/keyboard';
import styles from './input.module.scss';

type InputType = 'web' | 'chat';

type InputProps = {
  value: string;
  type?: InputType;
  placeholder?: string;
  isFocused?: boolean;
  onChange: (value: string) => void;
  onEnter?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

const Input: React.FC<InputProps> = (props) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const keyboardHandlers = {
    onEnter: props.onEnter,
  };

  useEffect(() => {
    if (props.isFocused) {
      inputEl.current?.focus();
    } else {
      inputEl.current?.blur();
    }
  }, [props.isFocused]);

  return (
    <KeyboardHandler handlers={keyboardHandlers}>
      <input
        ref={inputEl}
        className={styles[props.type || 'web']}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e): void => props.onChange(e.target.value)}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      />
    </KeyboardHandler>
  );
};

export default Input;
