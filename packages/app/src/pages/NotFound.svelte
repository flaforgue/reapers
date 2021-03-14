<div class="NotFound">
  <div class="background" />
  <div class="mask" />
  <p class="title">
    You did not found the page.
    <br />
    But the page found you.
  </p>
  <a href="#/">Back to civilization</a>
</div>

<style>
  .mask,
  .background {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
  }

  .background {
    text-align: center;
    background-image: url('/images/not-found.png');
    background-size: cover;
    background-position: center;
    filter: blur(0.5rem);
  }

  .mask {
    background-color: rgba(var(--color-black-rgb), 0.6);
  }

  .title {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    color: var(--color-white);
    font-size: 3rem;
    margin: 0;
    text-align: right;
  }

  a {
    color: var(--color-white);
    position: absolute;
    top: 1rem;
    left: 1rem;
  }
</style>
