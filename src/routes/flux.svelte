<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Fluctuator as Flux } from 'ctrnn.js';

	import Fluctuator from '../components/Fluctuator.svelte';
	import FluxGraph from '../vega/Fluctuator.svelte';

	let flux = new Flux(2);
	flux.amplitude_range.min = 0;
	let interval = setInterval(() => {
		// flux.update(0.05, 0.01);
		flux = flux;
	}, 1000 / 20);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<Fluctuator bind:fluctuator={flux} />
<FluxGraph bind:flux />
