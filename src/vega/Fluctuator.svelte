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
	export let reward = 0;

	table.push(
		...[
			{ c: 0, x: 0, y: flux.center },
			{ c: 1, x: 0, y: flux.value },
			{ c: 2, x: 0, y: flux.amplitude },
			{ c: 3, x: 0, y: 0 }
		]
	);

	let interval = setInterval(() => {
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
