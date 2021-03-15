import { ChatRoom, useChat } from '@reapers/chat-client-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { servers } from '../../../configs/servers.config';
import { FocusStore } from '../../../stores';
import { FocusElement } from '../../../types';
import { Input } from '../../web';
import styles from './Chat.module.scss';

type ChatProps = {
  playerName: string;
};

const Chat: React.FC<ChatProps> = (props) => {
  const [newMessage, setNewMessage] = useState('');
  const [currentRoom] = useState<ChatRoom>(ChatRoom.General);
  const messagesContainerEl = useRef<HTMLDivElement>(null);
  const setFocusElement = FocusStore.useStoreActions(
    (actions) => actions.setFocusElement,
  );
  const focusElement = FocusStore.useStoreState((state) => state.focusElement);
  const { joinChat, messages, sendMessage } = useChat(servers.chat.url);

  useEffect(() => {
    if (messagesContainerEl.current) {
      messagesContainerEl.current.scrollTop = messagesContainerEl.current.scrollHeight;
    }
  }, [messagesContainerEl.current, messages]);

  useEffect(() => {
    joinChat(props.playerName);
  }, [joinChat, props.playerName]);

  const handleInputEnter = () => {
    if (newMessage.length) {
      sendMessage(currentRoom, newMessage);
      setNewMessage('');
    } else {
      setFocusElement(FocusElement.Game);
    }
  };

  const handleInputFocus = useCallback(() => {
    setFocusElement(FocusElement.Chat);
  }, [setFocusElement]);

  const handleInputBlur = useCallback(() => {
    setFocusElement(FocusElement.Game);
  }, [setFocusElement]);

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
          isFocused={focusElement === FocusElement.Chat}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          type="chat"
        />
      </div>
    </div>
  );
};

export default Chat;
