<script lang="ts">
	import RangeSlider from 'svelte-range-slider-pips';

	export let center: number;
	export let amplitude: number;
	export let range: [number, number];
	export let step = 0.1;

	$: min = range[0];
	$: max = range[1];
	$: span = max - min;

	$: left = (center - min - amplitude) / span;
	$: right = 1.0 - (center - min + amplitude) / span;
</script>

<div class="container">
	<div class="amplitude">
		<div
			class="amplitude-inner"
			style="left: {Math.max(0, left * 100)}%; right: {Math.max(0, right * 100)}%"
		/>
	</div>
	<RangeSlider
		bind:values={center}
		{min}
		{max}
		{step}
		pips
		pipstep={40}
		first="label"
		last="label"
		springValues={{ stiffness: 1, damping: 1 }}
	/>
</div>

<style>
	.container {
		position: relative;
	}

	.amplitude {
		pointer-events: none;
		position: absolute;
		height: 8px;
		margin: 1em;
		left: 0px;
		right: 0px;
		top: -16px;
		z-index: 1;
	}

	.amplitude-inner {
		position: absolute;
		height: 100%;
		background-color: #4a40d4;
		border-radius: 8px;
	}
</style>
