<script lang="ts">
	import { onDestroy } from 'svelte';
	import Matrix from '../vega/Matrix.svelte';
	import Wind from '../vega/Wind.svelte';
	import { default as FluctuatorVega } from '../vega/Fluctuator.svelte';
	import { Fluctuator } from 'ctrnn.js';

	import { RlCtrnn } from 'ctrnn.js';

	let ctrnn = new RlCtrnn(2);
	ctrnn.setBias(0, -2.75);
	ctrnn.setBias(1, -1.75);
	ctrnn.setWeight(0, 0, 4.5 - 1);
	ctrnn.setWeight(0, 1, -1.0);
	ctrnn.setWeight(1, 0, 1.0);
	ctrnn.setWeight(1, 1, 4.5 + 1);

	let voltages = ctrnn.init_voltage();
	let interval = setInterval(() => {
		voltages = ctrnn.update(0.05, voltages);
		ctrnn = ctrnn;
		// console.log(ctrnn.weights[0][0]);
	}, 1000 / 60);
</script>

<!-- <Matrix {ctrnn} />
<Wind {ctrnn} /> -->
<FluctuatorVega />
