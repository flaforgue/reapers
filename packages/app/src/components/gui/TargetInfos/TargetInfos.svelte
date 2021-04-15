<script>
  import { CharacterDTO } from '@reapers/game-client';
  import ProgressBar from '../ProgressBar/ProgressBar.svelte';
  import colors from '../../../configs/colors.config';

  export let target: CharacterDTO;
</script>

<div class="targetInfos">
  <div class="name">
    {target.name} (Lv. {target.level})
  </div>

  <ProgressBar
    value={target.life.value}
    max={target.life.max}
    color={colors.characterLife}
  />
</div>

<style>
  .targetInfos {
    position: absolute;
    left: calc(50% - 10.5rem);
    width: 20rem;
    padding: 0.5rem;
    background-color: var(--color-black);
    border-bottom-left-radius: var(--default-border-radius);
    border-bottom-right-radius: var(--default-border-radius);
  }

  .name {
    color: var(--color-grey);
  }
</style>
