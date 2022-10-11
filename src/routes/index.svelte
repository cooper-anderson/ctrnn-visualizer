<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Fluctuator as Flux } from 'ctrnn.js';

	import { RlCtrnn } from 'ctrnn.js';
	import { Ctrnn } from 'ctrnn.js';
	import Fluctuator from '../components/Fluctuator.svelte';
	import Wind from '../vega/Wind.svelte';

	let ctrnn = new RlCtrnn(2);
	ctrnn.setBias(0, -2.75);
	ctrnn.setBias(1, -1.75);
	ctrnn.setWeight(0, 0, 4.5);
	ctrnn.setWeight(0, 1, -1.0);
	ctrnn.setWeight(1, 0, 1.0);
	ctrnn.setWeight(1, 1, 4.5);

	$: fluctuators = ctrnn.fluctuators;

	let voltages = ctrnn.init_voltage();
	// let flux = new Flux(0);
	// flux.amplitude_range.min = 0;
	// flux.convergence_rate /= 5;
	let interval = setInterval(() => {
		voltages = ctrnn.update(0.05, voltages, undefined, true);
		ctrnn = ctrnn;
		// flux.update(0.05, 0.01);
		// console.log(flux.center);
		// voltages = ctrnn.update(0.05, voltages);
		// ctrnn = ctrnn;
		// flux = flux;
	}, 1000 / 60);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<!--Fluctuator bind:fluctuator={flux} /-->
<div class="container">
	<div class="fluxs">
		<div>{ctrnn.weights[0][0]}</div>
		<div>{ctrnn.weights[0][1]}</div>
		<div>{ctrnn.weights[1][0]}</div>
		<div>{ctrnn.weights[1][1]}</div>
		<Fluctuator bind:fluctuator={fluctuators[0][0]} />
		<Fluctuator bind:fluctuator={fluctuators[0][1]} />
		<Fluctuator bind:fluctuator={fluctuators[1][0]} />
		<Fluctuator bind:fluctuator={fluctuators[1][1]} />
		<div>{fluctuators[0][0].center}</div>
		<div>{fluctuators[0][1].center}</div>
		<div>{fluctuators[1][0].center}</div>
		<div>{fluctuators[1][1].center}</div>
	</div>
	<div class="wind">
		<Wind {ctrnn} />
	</div>
</div>

<style>
	.container {
		display: flex;
	}

	.wind,
	.fluxs {
		flex: 1;
	}
</style>
