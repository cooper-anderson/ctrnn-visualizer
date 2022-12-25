<script lang="ts">
	import { onDestroy } from 'svelte';

	import { RlCtrnn } from 'ctrnn.js';
	import Sliders from '../areas/Sliders.svelte';
	import Wind from '../vega/Wind.svelte';
	// import Wind from '../vega/Wind.svelte';
	// import Activity from '../vega/Activity.svelte';

	const DT = 0.05;
	const QUEUE_DURATION = 5;
	const QUEUE_LENGTH = QUEUE_DURATION / DT;

	let time = 0;
	let ctrnn = new RlCtrnn(3);
	ctrnn.setBias(0, -2.75);
	ctrnn.setBias(1, -1.75);
	ctrnn.setWeight(0, 0, 4.5);
	ctrnn.setWeight(0, 1, -1.0);
	ctrnn.setWeight(1, 0, 1.0);
	ctrnn.setWeight(1, 1, 4.5);

	let interval = setInterval(() => {
		time += DT;
	}, DT * 1000);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="container">
	<div class="sidebar">
		<div class="about" />
		<div class="sliders">
			<Sliders bind:ctrnn />
		</div>
	</div>
	<div class="main">
		<div class="flux" />
		<div class="wind">
			<Wind bind:ctrnn />
		</div>
		<div class="other" />
	</div>
</div>

<style>
	.container {
		background-color: #424242;
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 10px;
		display: flex;
		gap: 10px;
	}

	.sidebar {
		flex: 1;
		display: flex;
		gap: 10px;
		flex-direction: column;
	}

	.main {
		flex: 2;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.sidebar > div,
	.main > div {
		background-color: #000;
		border-radius: 10px;
		padding: 10px;
	}

	.about {
		flex: 1;
	}

	.sliders {
		flex: 4;
	}

	.wind {
		grid-area: wind;
	}

	.flux {
		grid-area: flux;
	}

	.other {
		grid-area: other;
	}
</style>
