<script lang="ts">
	import { Vega } from 'svelte-vega';
	import spec from '../spec/line';

	type Point = {
		x: number;
		y: number;
		c: number;
	};

	export let points: Point[];

	$: data = { table: points };
</script>

<Vega {data} {spec} view={undefined} />
