<script lang="ts">
  import Router from 'svelte-spa-router';
  import routes from './configs/routes.config';
</script>

<div class="App">
  <Router {routes} />
</div>

<style>
  :root {
    --main-nav-height: 50px;

    --color-blue-pale: #3e4c5e;
    --color-blue: #2c3d55;
    --color-orange: #cd533b;
    --color-red-light: #e8c8c6;
    --color-red-dark: #9e2b25;
    --color-yellow: #e3d081;
    --color-background: #f2f6fc;
    --color-white: #ffffff;
    --color-grey-light: #eeeeee;
    --color-grey: #cccccc;
    --color-grey-dark: #2c2c2c;
    --color-black: #000000;
    --color-black-rgb: 0, 0, 0;
    --color-transparent: rgba(0, 0, 0, 0);

    --default-border-radius: 4px;
    --default-transition: 0.2s;
    --default-ui-opacity: 0.25;

    --default-transition-duration: 0.2s;

    --game-z-index: 0;
    --chat-z-index: 1;
  }
  :global(body) {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
  }

  :global(*) {
    outline: none !important;
  }

  .App {
    min-height: 100vh;
  }
</style>
