<script lang="ts">
	export let center: number;
	export let amplitude: number;
	export let range: [number, number];
	export let step = 0.01;
	export let locked = false;
	export let color: 'blue' | 'yellow' | 'red' | 'green' | 'grey' = 'grey';

	$: min = range[0];
	$: max = range[1];
	$: span = max - min;

	$: left = (center - min - amplitude) / span;
	$: right = 1.0 - (center - min + amplitude) / span;

	function mousedown() {
		locked = true;
	}

	function mouseup() {
		locked = false;
	}
</script>

<div class="container">
	<div class="amplitude">
		<div
			class="amplitude-inner {color}"
			style="left: {Math.max(0, left * 100)}%; right: {Math.max(0, right * 100)}%"
		/>
	</div>
	<input
		class={color}
		on:mousedown={mousedown}
		on:mouseup={mouseup}
		type="range"
		bind:value={center}
		{min}
		{max}
		{step}
	/>
</div>

<style>
	.container {
		position: relative;
		height: 40px;
	}

	.amplitude {
		pointer-events: none;
		position: absolute;
		background-color: #333;
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
		border-radius: 8px;
	}

	.amplitude-inner.blue {
		background-color: #137cbd;
	}

	.amplitude-inner.yellow {
		background-color: #d9822b;
	}

	.amplitude-inner.red {
		background-color: #db3737;
	}

	.amplitude-inner.green {
		background-color: #0f9960;
	}

	.amplitude-inner.grey {
		background-color: #888888;
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
		opacity: 0.9;
		width: 16px;
		height: 16px;
		border-radius: 10px;
		cursor: pointer;
	}

	input[type='range'].blue::-webkit-slider-thumb {
		background-color: #137cbd;
	}

	input[type='range'].yellow::-webkit-slider-thumb {
		background-color: #d9822b;
	}

	input[type='range'].red::-webkit-slider-thumb {
		background-color: #db3737;
	}

	input[type='range'].green::-webkit-slider-thumb {
		background-color: #0f9960;
	}

	input[type='range'].grey::-webkit-slider-thumb {
		background-color: #888888;
	}
</style>
