<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Fluctuator as Flux } from 'ctrnn.js';

	import Fluctuator from '../components/Fluctuator.svelte';
	import FluxGraph from '../vega/Fluctuator.svelte';

	let flux = new Flux(2);
	flux.amplitude_range.min = 0;
	flux.convergence_rate *= -3;
	flux.learning_rate *= 10;
	let locked = false;

	let input = new Flux(0);
	input.amplitude = 0;

	let reward = 0;
	let interval = setInterval(() => {
		const center = flux.center - input.center;
		const value = flux.value - input.center;
		const offset = Math.abs(center) - Math.abs(value);
		reward = Math.sign(offset) / 1000;
		if (!locked) {
			flux.amplitude = flux.amplitude * 0.9 + Math.abs(center) * 0.1;
			flux.update(0.05, reward);
		} else {
			flux.amplitude = 0;
		}
		flux = flux;
	}, 5);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="container">
	<Fluctuator bind:fluctuator={flux} bind:locked />
	<Fluctuator bind:fluctuator={input} />
	<FluxGraph bind:flux {reward} />
</div>

<style>
	.container {
		background-color: black;
		position: absolute;
		height: 100%;
		width: 100%;
	}
</style>
