<script lang="ts">
  import { useChat, ChatRoom, messages } from '@reapers/chat-client';
  import { servers } from '../../configs/servers.config';
  import { afterUpdate, onDestroy, onMount } from 'svelte';
  import { FocusElement, focusElement, playerName } from '../../stores';
  import Input from '../Input.svelte';

  let newMessage = '';
  let div: HTMLDivElement;
  let currentRoom: ChatRoom = ChatRoom.General;

  const { joinChat, leaveChat, sendMessage } = useChat(servers.chat.url);

  onMount(() => {
    joinChat($playerName);

    return leaveChat;
  });

  afterUpdate(() => {
    if (div.offsetHeight + div.scrollTop < div.scrollHeight) {
      div.scrollTop = div.scrollHeight;
    }
  });

  function handleInputEnter() {
    if (newMessage.length) {
      sendMessage(currentRoom, newMessage);
      newMessage = '';
    } else {
      $focusElement = FocusElement.Game;
    }
  }

  function handleInputFocus() {
    $focusElement = FocusElement.Chat;
  }

  function handleInputBlur() {
    $focusElement = FocusElement.Game;
  }
</script>

<div class="Chat">
  <div class="messagesContainer" bind:this={div}>
    {#each $messages as { content, sender }}
      <p class="message">
        <span class="sender">{sender}</span>&nbsp;:&nbsp;
        <span>{content}</span>
      </p>
    {/each}
  </div>
  <div class="inputContainer">
    <Input
      bind:value={newMessage}
      on:enter={handleInputEnter}
      on:focus={handleInputFocus}
      on:blur={handleInputBlur}
      isFocused={$focusElement === FocusElement.Chat}
    />
  </div>
</div>

<style>
  .Chat {
    --input-height: 30px;

    position: absolute;
    z-index: var(--chat-z-index);
    font-size: 1rem;
    bottom: 0;
    left: 0;
    width: 400px;
    height: 200px;
    color: var(--color-grey);
    background-color: rgba(var(--color-black-rgb), var(--default-ui-opacity));
    border-top-right-radius: var(--default-border-radius);
  }

  .messagesContainer {
    height: calc(100% - var(--input-height));
    overflow: scroll;
  }

  .message {
    margin: 2px 4px;
  }

  .sender {
    font-weight: bold;
  }

  .inputContainer {
    height: var(--input-height);
    width: calc(100% - 8px);
  }

  .inputContainer :global(input) {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    padding-left: 4px;
    padding-right: 4px;
    border: none;
    border-radius: 0;
    border-top: 1px solid rgba(var(--color-black-rgb), var(--default-ui-opacity));
    background-color: var(--color-transparent);
    color: var(--color-grey-light);
  }

  .inputContainer :global(input):focus {
    background-color: rgba(var(--color-black-rgb), var(--default-ui-opacity));
  }
</style>
