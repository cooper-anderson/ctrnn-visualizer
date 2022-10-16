<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Fluctuator } from 'ctrnn.js';

	import { Vega } from 'svelte-vega';
	import spec from '../spec/line';

	type Datum = { x: number; y: number; c: number };
	let table: Datum[] = [];
	$: data = { table };
	let t = 0;

	export let flux = new Fluctuator(2);
	flux.convergence_rate *= 2;
	// flux.learning_rate *= 5;
	flux.amplitude /= 10;
	// let data = getData(flux);

	// function getData(flux: Fluctuator): { table: Datum[] } {
	// 	const table: Datum[] = [];

	table.push(
		...[
			{ c: 0, x: 0, y: flux.center },
			{ c: 1, x: 0, y: flux.value },
			{ c: 2, x: 0, y: flux.amplitude },
			{ c: 3, x: 0, y: 0 }
		]
	);

	let last = flux.value;
	let reward = 0;
	let interval = setInterval(() => {
		const abs = Math.abs(flux.value);
		const r = (Math.abs(last) - Math.abs(flux.value)) / 10;
		reward = r;
		flux.amplitude = Math.min(abs, 10);
		// reward = -Math.abs(flux.value) / 10;
		// reward = reward * 0.99 + r * 0.01;
		last = flux.value;
		flux.update(0.05, reward);
		const time = Math.round(t * 100) / 100;

		const next = [
			{ c: 0, x: time, y: flux.center },
			{ c: 1, x: time, y: flux.value },
			{ c: 2, x: time, y: flux.amplitude },
			{ c: 3, x: time, y: reward * 100 }
		];
		// table = [...table, ...next];
		if (table.length < 4000) table = [...table, ...next];
		else table = [...table.slice(4), ...next];

		t += 0.05;
	}, 5);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<Vega {data} {spec} view={undefined} />
