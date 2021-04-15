<script lang="ts">
  import { push } from 'svelte-spa-router';
  import { playerName } from '../stores';
  import Input from '../components/gui/Input/Input.svelte';

  let error = '';

  function handleSubmit() {
    if ($playerName?.length > 0) {
      push('#/play');
    } else {
      error = 'A name is required';
    }
  }

  $: {
    if ($playerName?.length > 0) {
      error = '';
    }
  }
</script>

<div class="Home">
  <div class="background" />
  <div class="container">
    <div class="card">
      <Input on:enter={handleSubmit} bind:value={$playerName} placeholder="Name" />
      {#if error.length}
        <div class="error">{error}</div>
      {/if}

      <button class="button" on:click={handleSubmit}>Join</button>
    </div>
  </div>
</div>

<style>
  .background {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background-image: url('./images/background.jpg');
    background-position: 0 -12rem;
    background-repeat: no-repeat;
    filter: blur(0.5rem);
  }

  .container {
    width: 30rem;
    margin: auto;
    padding-top: 8rem;
  }

  .card {
    width: 100%;
    padding: 1rem;
    background-color: rgba(var(--color-black-rgb), 0.6);
    border-radius: var(--default-border-radius);
  }

  .error {
    color: var(--color-red-dark);
    padding: 1rem;
    margin: 1rem 0;
    width: calc(100% - 2rem);
    background-color: var(--color-red-light);
    border-radius: var(--default-border-radius);
  }

  .button {
    cursor: pointer;
    padding: 0.5rem 2rem;
    margin: 1rem auto 0 auto;
    display: block;
    color: var(--color-white);
    background-color: var(--color-blue-pale);
    border-radius: var(--default-border-radius);
    border: none;
    transition: background-color var(--default-transition-duration);
  }

  .button:hover {
    background-color: var(--color-blue-pale);
  }
</style>
