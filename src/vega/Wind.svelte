<script lang="ts">
	import type { ICTRNN } from 'ctrnn.js';
	import { inverseSigmoid } from 'ctrnn.js/src/activation';

	import { Vega } from 'svelte-vega';
	import wind from '../spec/wind';

	export let points: Point[] = [];
	export let width: number = 300;
	export let height: number = 300;

	type Point = {
		x: number;
		y: number;
	};

	type Vec = {
		longitude: number;
		latitude: number;
		dir: number;
		// dirCat: number;
		speed: number;
	};

	export let ctrnn: ICTRNN;
	$: data = getData(ctrnn);

	const step = 1 / 25;

	function clampSigmoid(v: number): number {
		return inverseSigmoid(Math.min(Math.max(v, 0.01), 0.99));
	}
	function getVoltage(outputs: number[], ctrnn: ICTRNN): number[] {
		return outputs.map((v, i) => clampSigmoid(v) - ctrnn.biases[i]);
	}

	function getData(ctrnn: ICTRNN): { vectors: Vec[]; points: Point[] } {
		const vectors: Vec[] = [];
		for (let y = 0; y <= 1; y += step) {
			for (let x = 0; x <= 1; x += step) {
				const pos = [x, y];
				const before = getVoltage(pos, ctrnn);
				while (before.length < ctrnn.size) before.push(0);
				const after = ctrnn.update(0.05, before);
				const outputs = ctrnn.getOutputs(after);
				const diff = [outputs[0] - pos[0], outputs[1] - pos[1]];

				let theta = Math.atan2(diff[1], diff[0]);
				theta = (theta * 180) / Math.PI;
				theta = (theta + 360) % 360;

				vectors.push({
					longitude: y,
					latitude: x,
					dir: theta,
					speed: Math.hypot(diff[0], diff[1])
				});
			}
		}

		return { vectors, points };
	}

	// $: min = Math.min(width, height) - 10;
	$: spec = {
		...wind,
		width: width,
		height: height
	};
</script>

<!-- <div class="container"> -->
<Vega {data} {spec} view={undefined} />

<!-- </div> -->
<style>
	.container {
		/* width: 100%;
		height: 100%; */
	}
</style>
