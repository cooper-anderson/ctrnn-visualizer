<script lang="ts">
	import type { Fluctuator } from 'ctrnn.js';
	import FluxSlider from './FluxSlider.svelte';

	export let fluctuator: Fluctuator;
	export let locked: boolean = false;
</script>

<FluxSlider
	bind:center={fluctuator.center}
	bind:locked
	amplitude={fluctuator.amplitude}
	range={[fluctuator.range.min, fluctuator.range.max]}
/>
