<script lang="ts">
	export let center: number;
	export let amplitude: number;
	export let range: [number, number];
	export let step = 0.01;

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
	<input type="range" bind:value={center} {min} {max} {step} />
</div>

<style>
	.container {
		position: relative;
		height: 40px;
	}

	.amplitude {
		pointer-events: none;
		position: absolute;
		background-color: #eee;
		height: 8px;
		margin: 1em;
		left: 0px;
		right: 0px;
		top: 0px;
		border-radius: 8px;
	}

	.amplitude-inner {
		pointer-events: none;
		position: absolute;
		height: 100%;
		background-color: #4a40d4;
		border-radius: 8px;
	}

	input[type='range'] {
		-webkit-appearance: none;
		height: 8px;
		left: 6px;
		right: 6px;
		position: absolute;
		background-color: transparent;
		top: 14px;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		background-color: #4a40d4;
		opacity: 0.9;
		width: 16px;
		height: 16px;
		border-radius: 10px;
		cursor: pointer;
	}
</style>
