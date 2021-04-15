<script lang="ts">
  import { targetInfos, playerInfos } from '../../../stores';
  import Chat from '../Chat/Chat.svelte';
  import PlayerInfos from '../PlayerInfos/PlayerInfos.svelte';
  import TargetInfos from '../TargetInfos/TargetInfos.svelte';
</script>

<div class="GUI">
  <Chat />
  <PlayerInfos player={$playerInfos} />

  {#if $targetInfos}
    <TargetInfos target={$targetInfos} />
  {/if}
</div>

<style>
  .GUI {
    z-index: var(--gui-z-index);
  }
</style>
