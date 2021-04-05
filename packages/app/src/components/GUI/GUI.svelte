<script lang="ts">
  import { targetInfos } from '../../stores';
</script>

<div class="GUI">
  {#if $targetInfos}
    <div class="targetInfosContainer">
      <div class="name">
        {$targetInfos.name} (Lv. {$targetInfos.level})
      </div>

      <div class="life">
        <div
          class="current-life"
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
  .GUI .current-life {
    border-radius: var(--default-border-radius);
  }

  .GUI .life {
    width: 100%;
    height: 1rem;
    border: 1px solid var(--color-orange-dark);
    margin-top: 0.25rem;
  }

  .GUI .current-life {
    width: 100%;
    height: 100%;
    background-color: var(--color-orange);
    transition: width var(--default-transition-duration) ease-out;
  }
</style>
