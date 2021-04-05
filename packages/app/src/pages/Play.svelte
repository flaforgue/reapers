<script lang="ts">
  import { push } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { FocusElement, focusElement, playerName } from '../stores';
  import { Key } from '../configs/keycodes.config';
  import Chat from '../components/Chat/Chat.svelte';
  import Game from '../components/Game/Game.svelte';
  import GUI from '../components/GUI/GUI.svelte';

  if (!String($playerName).length) {
    push('#/');
  }

  onMount(() => {
    document.body.style.overflow = 'hidden';
    function focusChatOnEnter(e: KeyboardEvent) {
      if (e.key === Key.Enter && $focusElement !== FocusElement.Chat) {
        $focusElement = FocusElement.Chat;
      }
    }

    window.addEventListener('keyup', focusChatOnEnter);

    return () => {
      window.removeEventListener('keyup', focusChatOnEnter);
      document.body.style.overflow = 'initial';
    };
  });
</script>

<div class="Play">
  <Chat />
  <Game />
  <GUI />
</div>

<style>
  .Play {
    width: 100%;
    height: 100%;
  }
</style>
