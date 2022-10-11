<script lang="ts">
	import type { Fluctuator } from 'ctrnn.js';
	import FluxSlider from './FluxSlider.svelte';

	export let fluctuator: Fluctuator;
</script>

<FluxSlider
	bind:center={fluctuator.center}
	amplitude={fluctuator.amplitude}
	range={[fluctuator.range.min, fluctuator.range.max]}
/>
