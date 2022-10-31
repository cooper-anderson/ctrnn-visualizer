import { scheme } from 'vega';
import type { VisualizationSpec } from 'vega-embed';

export default {
	$schema: 'https://vega.github.io/schema/vega/v5.json',
	description: 'A flow map of wind direction and speed.',
	width: 700,
	height: 700,
	padding: 2,
	background: '#111',

	data: [
		{
			name: 'vectors',
			format: { type: 'json' }
		},
		{
			name: 'points',
			format: { type: 'json' }
		}
	],

	scales: [
		{
			name: 'xscale',
			type: 'point',
			range: 'width',
			paddingOuter: 0.5,
			domain: { data: 'vectors', field: 'longitude', sort: true }
		},
		{
			name: 'yscale',
			type: 'point',
			range: 'height',
			paddingOuter: 0.5,
			reverse: true,
			domain: { data: 'vectors', field: 'latitude', sort: true }
		},
		{
			name: 'size',
			domain: { data: 'vectors', field: 'speed' },
			zero: true,
			range: [0, 700]
		},
		{
			name: 'color',
			domain: [0, 360],
			range: { scheme: 'rainbow' }
		},
		{
			name: 'x',
			type: 'linear',
			range: 'width',
			paddingOuter: 0.5
		},
		{
			name: 'y',
			type: 'linear',
			range: 'height',
			paddingOuter: 0.5
		},
		{
			name: 'opacity',
			domain: [0, 20],
			range: [0, 1]
			// domain: { data: 'points', field: 'time' }
		}
	],

	marks: [
		{
			type: 'symbol',
			from: { data: 'vectors' },
			encode: {
				enter: {
					x: { scale: 'xscale', field: 'longitude' },
					y: { scale: 'yscale', field: 'latitude' },
					fill: { scale: 'color', field: 'dir' },
					angle: { field: 'dir', offset: 0 }
				},
				update: {
					shape: { value: 'wedge' },
					size: { scale: 'size', field: 'speed' }
				}
			}
		},
		{
			type: 'line',
			from: { data: 'points' },
			encode: {
				enter: {
					x: { scale: 'x', field: 'y' },
					y: { scale: 'y', field: 'x' },
					stroke: { value: '#fff' },
					strokeWidth: { value: 1 }
					// opacity: { scale: 'opacity', field: 'time' }
				},
				update: {
					// stroke: { scale: 'opacity', field: 'time' }
					// opacity: { scale: 'opacity', field: 'time' }
				}
			}
		}
	]
} as VisualizationSpec;
