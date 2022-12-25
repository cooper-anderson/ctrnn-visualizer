<script lang="ts">
	import type { RlCtrnn } from 'ctrnn.js';
	import Fluctuator from '../components/Fluctuator.svelte';

	export let ctrnn: RlCtrnn;

	$: fluctuators = ctrnn.fluctuators;
	const locks = Array(ctrnn.size).fill(Array(ctrnn.size).fill(false));
	type Color = 'blue' | 'yellow' | 'red' | 'green' | 'grey';

	function getColor(pre: number, post: number) {
		if (pre == 0 && post == 0) return 'blue';
		if (pre == 0 && post == 1) return 'yellow';
		if (pre == 1 && post == 0) return 'red';
		if (pre == 1 && post == 1) return 'green';
		return 'grey';
	}
</script>

<div class="fluxs">
	{#each fluctuators as row, pre}
		{#each row as flux, post}
			<Fluctuator
				bind:fluctuator={flux}
				bind:locked={locks[pre][post]}
				color={getColor(pre, post)}
			/>
		{/each}
	{/each}
</div>
