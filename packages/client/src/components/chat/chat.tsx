import { ChatRoom, useChat } from '@reapers/chat-client';
import React, { useEffect, useRef, useState } from 'react';
import { servers } from '../../configs/servers';
import { Key } from '../../configs/keycodes';
import { Input } from '../web';
import styles from './chat.module.scss';

type ChatProps = {
  playerName: string;
};

const Chat: React.FC<ChatProps> = (props) => {
  const [newMessage, setNewMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom>(ChatRoom.General);
  const messagesContainerEl = useRef<HTMLDivElement>(null);
  const { joinChat, messages, sendMessage } = useChat(servers.chat.url);

  useEffect(() => {
    if (messagesContainerEl.current) {
      messagesContainerEl.current.scrollTop = messagesContainerEl.current.scrollHeight;
    }
  });

  const handleWindowKeyup = (): (() => void) => {
    const focusInputOnEnter = (e: KeyboardEvent): void => {
      if (e.key === Key.Enter && !isInputFocused) {
        setIsInputFocused(true);
      }
    };

    window.addEventListener('keyup', focusInputOnEnter);

    return (): void => {
      window.removeEventListener('keyup', focusInputOnEnter);
    };
  };

  useEffect(handleWindowKeyup, [setIsInputFocused, isInputFocused]);

  useEffect((): void => {
    joinChat(props.playerName);
  }, [joinChat, props.playerName]);

  const handleInputEnter = (): void => {
    if (newMessage.length) {
      sendMessage(currentRoom, newMessage);
      setNewMessage('');
    } else {
      setIsInputFocused(false);
    }
  };

  return (
    <div className={styles.chat}>
      <div className={styles.messagesContainer} ref={messagesContainerEl}>
        {messages.map(({ content, sender }, index) => (
          <p key={index} className={styles.message}>
            <span className={styles.sender}>{sender}</span>&nbsp;:&nbsp;
            <span className={styles.message}>{content}</span>
          </p>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <Input
          value={newMessage}
          onChange={setNewMessage}
          onEnter={handleInputEnter}
          isFocused={isInputFocused}
          setIsFocused={setIsInputFocused}
          type="chat"
        />
      </div>
    </div>
  );
};

export default Chat;
