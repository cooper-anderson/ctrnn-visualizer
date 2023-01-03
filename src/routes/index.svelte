<script lang="ts">
	import { onDestroy } from 'svelte';

	import { RlCtrnn } from 'ctrnn.js';
	import Fluctuator from '../components/Fluctuator.svelte';
	import Wind from '../vega/Wind.svelte';
	import Activity from '../vega/Activity.svelte';

	const DT = 0.05;
	const QUEUE_DURATION = 2;
	const QUEUE_LENGTH = QUEUE_DURATION / DT;

	let time = 0;
	let ctrnn = new RlCtrnn(2);
	ctrnn.setBias(0, -2.75);
	ctrnn.setBias(1, -1.75);
	ctrnn.setWeight(0, 0, 4.5);
	ctrnn.setWeight(0, 1, -1.0);
	ctrnn.setWeight(1, 0, 1.0);
	ctrnn.setWeight(1, 1, 4.5);
	// ctrnn.addNode();

	for (const asdf of ctrnn.fluctuators) {
		for (const flux of asdf) {
			flux.period_range.min = 6;
			flux.period_range.max = 12;
			flux.randomize_period();
		}
	}

	$: fluctuators = ctrnn.fluctuators;
	let locks = Array(ctrnn.size).fill(Array(ctrnn.size).fill(false));
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

	let activityHistory = [];
	let fitnessHistory = [];
	let fitness_sums = [];
	let avg_fitness_sums = [];
	let reward = 0;

	let fluxQueue = [];
	let pointsQueue = [];

	let interval = setInterval(() => {
		if (locks.length < ctrnn.size) {
			locks = Array(ctrnn.size).fill(Array(ctrnn.size).fill(false));
		}
		while (voltages.length < ctrnn.size) voltages.push(0);
		while (activityHistory.length < ctrnn.size) activityHistory.push([]);
		while (fitnessHistory.length < ctrnn.size) fitnessHistory.push([]);
		while (fitness_sums.length < ctrnn.size) fitness_sums.push(0);
		while (avg_fitness_sums.length < ctrnn.size) avg_fitness_sums.push(0);

		for (let post = 0; post < ctrnn.size; post++) {
			let activity = Math.abs(outputs[post] - last[post] || 0);
			activityHistory[post].push(activity);
			fitness_sums[post] += activity;
			if (activityHistory[post].length > QUEUE_LENGTH) {
				fitness_sums[post] -= activityHistory[post].shift();
			}
			let fitness = fitness_sums[post] / QUEUE_LENGTH;

			fitnessHistory[post].push(fitness);
			avg_fitness_sums[post] += fitness;
			if (fitnessHistory[post].length > QUEUE_LENGTH) {
				avg_fitness_sums[post] -= fitnessHistory[post].shift();
			}
			let avg_fitness = avg_fitness_sums[post] / QUEUE_LENGTH;
			let reward = fitness - avg_fitness;

			for (let pre = 0; pre < ctrnn.size; pre++) {
				if (locks[pre][post]) {
					fluctuators[pre][post].amplitude = 0;
				} else {
					// fluctuators[post][pre].update(DT, reward);
					fluctuators[pre][post].update(DT, reward);
				}
			}
		}

		last = outputs;
		voltages = ctrnn.update(DT * 20, voltages);

		let x = Math.floor(time * 100) / 100;
		let next = [
			{ c: 0, x, y: fluctuators[0][0].value },
			{ c: 1, x, y: fluctuators[0][1].value },
			{ c: 2, x, y: fluctuators[1][0].value },
			{ c: 3, x, y: fluctuators[1][1].value },
			{ c: 4, x, y: reward * 100 },
			{ c: 5, x, y: fitness_sums[0] },
			{ c: 6, x, y: fitness_sums[1] }
		];
		if (fluxQueue.length < 1000) fluxQueue = [...fluxQueue, ...next];
		else fluxQueue = [...fluxQueue.slice(7), ...next];

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

	function addNode(event: MouseEvent) {
		ctrnn.addNode();
	}
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
		<button on:click={addNode}>add node</button>
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
