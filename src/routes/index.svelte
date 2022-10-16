<script lang="ts">
	import { onDestroy } from 'svelte';

	import { RlCtrnn } from 'ctrnn.js';
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
	const locks = [
		[false, false],
		[false, false]
	];

	let amplitude = 0.1;
	ctrnn.fluctuators[0][0].amplitude = amplitude;
	ctrnn.fluctuators[0][1].amplitude = amplitude * 0;
	ctrnn.fluctuators[1][0].amplitude = amplitude * 0;
	ctrnn.fluctuators[1][1].amplitude = amplitude * 0;

	let voltages = ctrnn.init_voltage();
	$: outputs = ctrnn.getOutputs(voltages);
	let last = [0, 0];
	let activity = 0;
	let interval = setInterval(() => {
		let a = 0;
		for (let i = 0; i < outputs.length; i++) {
			a += Math.abs(outputs[i] - last[i]);
		}
		activity = 0.99 * activity + 0.01 * a;
		last = outputs;
		voltages = ctrnn.update(0.05, voltages);
		for (let pre = 0; pre < ctrnn.size; pre++) {
			for (let post = 0; post < ctrnn.size; post++) {
				if (locks[pre][post]) {
					fluctuators[pre][post].amplitude = 0;
				} else {
					fluctuators[pre][post].update(0.05, activity - 0.003);
				}
			}
		}
		ctrnn = ctrnn;
	}, 5);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="container">
	<div class="fluxs">
		{#each fluctuators as row, pre}
			{#each row as flux, post}
				<Fluctuator bind:fluctuator={flux} bind:locked={locks[pre][post]} />
			{/each}
		{/each}
		<div>{outputs[0]}</div>
		<div>{outputs[1]}</div>
		<div>{activity}</div>
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
