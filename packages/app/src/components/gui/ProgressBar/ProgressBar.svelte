<script lang="ts">
  export let value = 0;
  export let max = 1;
  export let color: string | null = '#F00';
  export let textColor: string | null = '#FFF';
</script>

<div class="progressBar" style="border-color: {color}">
  <div
    class="currentValueBar"
    style="width: {(value / max) * 100}%; background-color: {color};border-color: {color}"
  />
  <span class="label" style="color: {textColor}">{value} / {max}</span>
</div>

<style>
  .progressBar,
  .currentValueBar {
    border-radius: var(--default-border-radius);
    border: 1px solid;
  }

  .progressBar {
    width: 100%;
    height: 1rem;
    position: relative;
  }

  .progressBar .label {
    position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
  }

  .currentValueBar {
    width: 100%;
    height: calc(100% - 2px);
    transition: width var(--default-transition-duration) ease-out;
  }
</style>
