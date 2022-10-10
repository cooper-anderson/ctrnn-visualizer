<script lang="ts">
	import { onDestroy } from 'svelte';
	// import { Fluctuator } from 'ctrnn.js';

	import { RlCtrnn } from 'ctrnn.js';
	import FluxSlider from '../components/FluxSlider.svelte';

	let ctrnn = new RlCtrnn(2);
	ctrnn.setBias(0, -2.75);
	ctrnn.setBias(1, -1.75);
	ctrnn.setWeight(0, 0, 4.5 - 1);
	ctrnn.setWeight(0, 1, -1.0);
	ctrnn.setWeight(1, 0, 1.0);
	ctrnn.setWeight(1, 1, 4.5 + 1);

	$: weights = ctrnn.fluctuators;

	let voltages = ctrnn.init_voltage();
	let interval = setInterval(() => {
		voltages = ctrnn.update(0.05, voltages);
		ctrnn = ctrnn;
	}, 1000 / 60);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<FluxSlider bind:center={ctrnn.weights[0][0]} amplitude={4} range={[-16, 16]} />
<FluxSlider bind:center={ctrnn.weights[0][1]} amplitude={4} range={[-16, 16]} />
<FluxSlider bind:center={ctrnn.weights[1][0]} amplitude={4} range={[-16, 16]} />
<FluxSlider bind:center={ctrnn.weights[1][1]} amplitude={4} range={[-16, 16]} />
