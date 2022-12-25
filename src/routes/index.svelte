<script lang="ts">
	import { onDestroy } from 'svelte';

	import { RlCtrnn } from 'ctrnn.js';
	import Fluctuator from '../components/Fluctuator.svelte';
	import Wind from '../vega/Wind.svelte';
	import Activity from '../vega/Activity.svelte';

	const DT = 0.05;
	const QUEUE_DURATION = 5;
	const QUEUE_LENGTH = QUEUE_DURATION / DT;

	let time = 0;
	let ctrnn = new RlCtrnn(2);
	ctrnn.setBias(0, -2.75);
	ctrnn.setBias(1, -1.75);
	ctrnn.setWeight(0, 0, 4.5);
	ctrnn.setWeight(0, 1, -1.0);
	ctrnn.setWeight(1, 0, 1.0);
	ctrnn.setWeight(1, 1, 4.5);

	for (const asdf of ctrnn.fluctuators) {
		for (const flux of asdf) {
			flux.period_range.min = 6;
			flux.period_range.max = 12;
			flux.randomize_period();
		}
	}

	$: fluctuators = ctrnn.fluctuators;
	const locks = Array(ctrnn.size).fill(Array(ctrnn.size).fill(false));
	// const locks = [
	// 	[false, false],
	// 	[false, false]
	// ];
	type Color = 'blue' | 'yellow' | 'red' | 'green' | 'grey';
	const colors: Color[][] = [
		['blue', 'yellow'],
		['red', 'green']
	];

	let amplitude = 0.1;
	ctrnn.fluctuators[0][0].amplitude = amplitude;
	ctrnn.fluctuators[0][1].amplitude = amplitude;
	ctrnn.fluctuators[1][0].amplitude = amplitude;
	ctrnn.fluctuators[1][1].amplitude = amplitude;

	let voltages = ctrnn.init_voltage();
	$: outputs = ctrnn.getOutputs(voltages);
	let last = [0, 0];

	let queue = [];
	let avg_queue = [];
	let fitness_sum = 0;
	let avg_fitness_sum = 0;
	let reward = 0;

	let fluxQueue = [];
	let pointsQueue = [];

	let interval = setInterval(() => {
		let activity = 0;
		for (let i = 0; i < outputs.length; i++) {
			activity += Math.abs(outputs[i] - last[i]);
		}

		queue.push(activity);
		fitness_sum += activity;
		if (queue.length > QUEUE_LENGTH) {
			fitness_sum -= queue.shift();
		}
		let fitness = fitness_sum / QUEUE_LENGTH;

		avg_queue.push(fitness);
		avg_fitness_sum += fitness;
		if (avg_queue.length > QUEUE_LENGTH) {
			avg_fitness_sum -= avg_queue.shift();
		}
		// reward = fitness_sum - last_fitness; //- 0.1 * DT;
		let avg_fitness = avg_fitness_sum / QUEUE_LENGTH;
		reward = fitness - avg_fitness;

		last = outputs;
		voltages = ctrnn.update(DT * 20, voltages);
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
			{ c: 5, x, y: fitness_sum }
		];
		if (fluxQueue.length < 1000) fluxQueue = [...fluxQueue, ...next];
		else fluxQueue = [...fluxQueue.slice(5), ...next];

		let point = { x: outputs[0], y: outputs[1], time: x };
		pointsQueue.push(point);
		if (pointsQueue.length > QUEUE_DURATION / DT) pointsQueue.shift();
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
					color={(colors[pre] || [])[post] || 'grey'}
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
		background-color: black;
		display: flex;
		position: absolute;
		height: 100%;
		width: 100%;
	}

	.fluxs {
		flex: 1;
	}
</style>
