<script>
    export let whCircle = 155;
    export let title = "";
    export let total = "";
    export let color = "";
    export let percent = "";
    let unit = "Broadcast";

    function checkWords(words) {
        return words.split(' ');
    }
</script>

<svg class="circle-chart" viewbox="0 0 33.83098862 33.83098862" width="{whCircle}" height="{whCircle}" xmlns="http://www.w3.org/2000/svg">
    <circle class="circle-chart__background" stroke="#D1D5DB" stroke-width="2" fill="none" cx="16.91549431" cy="16.91549431" r="15.91549431" />
    <circle class="circle-chart__circle" stroke={color} stroke-width="2" stroke-dasharray="{Math.round(percent, 0)},100" stroke-linecap="round" fill="none" cx="16.91549431" cy="16.91549431" r="15.91549431" />
    <g class="circle-chart__info">
        {#if checkWords(title).length > 1}
        <text class="circle-chart__percent" x="16.91549431" y="6.7" alignment-baseline="central" text-anchor="middle" font-size="4">{checkWords(title)[0]}</text><text class="circle-chart__percent" x="16.91549431" y="11" alignment-baseline="central" text-anchor="middle" font-size="4">{checkWords(title)[1]}</text>
        {:else}
        <text class="circle-chart__percent" x="16.91549431" y="10.5" alignment-baseline="central" text-anchor="middle" font-size="4">{title}</text>
        {/if}
      <text class="circle-chart__subline" x="16.91549431" y="17.6" alignment-baseline="central" text-anchor="middle" font-size="10">{total}</text>
      <text class="circle-chart__subline" x="16.91549431" y="24.5" alignment-baseline="central" text-anchor="middle" font-size="3">{unit}</text>
      <text class="circle-chart__subline" x="16.91549431" y="28" alignment-baseline="central" text-anchor="middle" font-size="3">{percent}%</text>
    </g>
</svg>

<style>
    .circle-chart__circle {
  animation: circle-chart-fill 2s reverse; /* 1 */ 
  transform: rotate(-90deg); /* 2, 3 */
  transform-origin: center; /* 4 */
}
</style>