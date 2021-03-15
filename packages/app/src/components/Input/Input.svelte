<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Key } from '../../../src/configs/keycodes.config';

  export let isFocused = false;
  export let placeholder = '';
  export let value = '';

  let input: HTMLInputElement;

  const dispatch = createEventDispatcher();
  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === Key.Enter) {
      dispatch('enter');
    }
  }

  $: {
    if (isFocused) {
      input?.focus();
    } else {
      input?.blur();
    }
  }
</script>

<input
  bind:value
  bind:this={input}
  on:keyup|stopPropagation={handleKeyUp}
  on:focus
  on:blur
  type="text"
  {placeholder}
/>

<style>
  input {
    width: calc(100% - 2rem);
    padding: 0.5rem 1rem;
    background-color: var(--color-background);
    border: 1px solid var(--color-grey-light);
    border-radius: var(--default-border-radius);
  }

  input:active,
  input:focus {
    border-color: var(--color-grey);
  }
</style>
