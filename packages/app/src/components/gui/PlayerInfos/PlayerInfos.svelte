<script lang="ts">
  import { CharacterDTO } from '@reapers/game-client';
  import colorsConfig from '../../../configs/colors.config';

  import ProgressBar from '../ProgressBar/ProgressBar.svelte';

  export let player: CharacterDTO;
</script>

<div class="playerInfos">
  <div class="playerHeader">
    <p>{player.name}</p>
    <p>Lv. {player.level}</p>
  </div>

  <ProgressBar
    value={player.life.value}
    max={player.life.max}
    color={colorsConfig.playerLife}
  />
</div>

<style>
  .playerInfos {
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
