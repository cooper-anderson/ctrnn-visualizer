<script lang="ts">
	import { onDestroy } from 'svelte';

	import { RlCtrnn } from 'ctrnn.js';
	import Fluctuator from '../components/Fluctuator.svelte';
	import Wind from '../vega/Wind.svelte';
	import Activity from '../vega/Activity.svelte';

	const DT = 0.05;
	const QUEUE_DURATION = 20;
	const QUEUE_LENGTH = QUEUE_DURATION / DT;

	let time = 0;
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
	type Color = 'blue' | 'yellow' | 'red' | 'green';
	const colors: Color[][] = [
		['blue', 'yellow'],
		['red', 'green']
	];

	let amplitude = 0.0;
	ctrnn.fluctuators[0][0].amplitude = amplitude;
	ctrnn.fluctuators[0][1].amplitude = amplitude;
	ctrnn.fluctuators[1][0].amplitude = amplitude;
	ctrnn.fluctuators[1][1].amplitude = amplitude;

	let voltages = ctrnn.init_voltage();
	$: outputs = ctrnn.getOutputs(voltages);
	let last = [0, 0];

	let queue = [];
	let fitness = 0;
	let reward = 0;

	let fluxQueue = [];
	let pointsQueue = [];

	let interval = setInterval(() => {
		let activity = 0;
		for (let i = 0; i < outputs.length; i++) {
			activity += Math.abs(outputs[i] - last[i]);
		}

		queue.push(activity);
		let last_fitness = fitness;
		fitness += activity;
		if (queue.length > QUEUE_LENGTH) {
			fitness -= queue.shift();
		}
		reward = fitness - last_fitness; //- 0.1 * DT;

		last = outputs;
		voltages = ctrnn.update(DT * 10, voltages);
		for (let pre = 0; pre < ctrnn.size; pre++) {
			for (let post = 0; post < ctrnn.size; post++) {
				if (locks[pre][post]) {
					fluctuators[pre][post].amplitude = 0;
				} else {
					fluctuators[pre][post].update(DT, reward);
				}
			}
		}

		let x = Math.floor(time * 100) / 100;
		let next = [
			{ c: 0, x, y: fluctuators[0][0].value },
			{ c: 1, x, y: fluctuators[0][1].value },
			{ c: 2, x, y: fluctuators[1][0].value },
			{ c: 3, x, y: fluctuators[1][1].value },
			{ c: 4, x, y: reward * 100 },
			{ c: 5, x, y: fitness }
		];
		if (fluxQueue.length < 1000) fluxQueue = [...fluxQueue, ...next];
		else fluxQueue = [...fluxQueue.slice(5), ...next];

		let point = { x: outputs[0], y: outputs[1], time: x };
		pointsQueue.push(point);
		if (pointsQueue.length > 20 / DT) pointsQueue.shift();
		pointsQueue = pointsQueue;

		ctrnn = ctrnn;
		time += DT;
	}, 0);

	// type Point = {
	// 	x: number;
	// 	y: number;
	// };

	// function getTrajectory(ctrnn: RlCtrnn): Point[] {
	// 	let points = [];
	// 	let voltage = ctrnn.init_voltage();
	// 	for (let t = 0; t < 50; t += 0.05) {
	// 		const output = ctrnn.getOutputs(voltage);
	// 		points.push({ x: output[0], y: output[1] });
	// 		voltage = ctrnn.update(0.05, voltage);
	// 	}

	// 	return points;
	// }

	// $: points = getTrajectory(ctrnn);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="container">
	<div class="fluxs">
		{#each fluctuators as row, pre}
			{#each row as flux, post}
				<Fluctuator
					bind:fluctuator={flux}
					bind:locked={locks[pre][post]}
					color={colors[pre][post]}
				/>
			{/each}
		{/each}
		<!--div>{outputs[0]}</div>
		<div>{outputs[1]}</div>
		<div>{fitness / QUEUE_DURATION}</div>
		<div>{reward}</div-->
		<Activity points={fluxQueue} />
	</div>
	<div class="wind">
		<Wind {ctrnn} points={pointsQueue} />
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
