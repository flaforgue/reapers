<script lang="ts">
  import { targetInfos, playerInfos } from '../../stores';
</script>

<div class="GUI">
  <!-- playerInfos.svelte, to finish -->
  <div class="playerInfos">
    <div class="playerHeader">
      <p>{$playerInfos.name}</p>
      <p>Lv. {$playerInfos.level}</p>
    </div>
    <div class="life">
      <div
        class="currentLife"
        style="width: {($playerInfos.life.value / $playerInfos.life.max) * 100}%"
      />
      <span class="life-label">{$playerInfos.life.value} / {$playerInfos.life.max}</span>
    </div>
  </div>
  <!-- TargetInfos.svelte, to split -->
  {#if $targetInfos}
    <div class="targetInfosContainer">
      <div class="name">
        {$targetInfos.name} (Lv. {$targetInfos.level})
      </div>

      <!-- ProgressBar.svelte, to split -->
      <div class="life">
        <div
          class="currentLife"
          style="width: {($targetInfos.life.value / $targetInfos.life.max) * 100}%"
        />
      </div>
    </div>
  {/if}
</div>

<style>
  .GUI .targetInfosContainer {
    position: absolute;
    left: calc(50% - 10.5rem);
    width: 20rem;
    padding: 0.5rem;
    background-color: var(--color-black);
    border-bottom-left-radius: var(--default-border-radius);
    border-bottom-right-radius: var(--default-border-radius);
  }

  .GUI .name {
    color: var(--color-grey);
  }

  .GUI .life,
  .GUI .currentLife {
    border-radius: var(--default-border-radius);
  }

  .GUI .life {
    width: 100%;
    height: 1rem;
    border: 1px solid var(--color-orange-dark);
    position: relative;
  }

  .GUI .life .life-label {
    text-align: center;
    position: absolute;
    top: 0;
    width: 100%;
  }

  .GUI .targetInfosContainer .life {
    margin-top: 0.25rem;
  }

  .GUI .currentLife {
    width: 100%;
    height: 100%;
    background-color: var(--color-orange);
    transition: width var(--default-transition-duration) ease-out;
  }

  .GUI .playerInfos {
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--color-black);
    width: 20rem;
    padding: 0.5rem;
    color: var(--color-white);
  }

  .playerHeader {
    display: flex;
    justify-content: space-between;
  }

  .playerHeader p {
    margin: 0.1rem 0;
  }
</style>
