import type { VisualizationSpec } from 'vega-embed';

export default {
	$schema: 'https://vega.github.io/schema/vega/v5.json',
	description: 'A flow map of wind direction and speed.',
	width: 700,
	height: 700,
	padding: 2,
	// width: 800,
	// height: 600,
	// padding: 5,
	// autosize: { type: "none", contains: "padding" },
	background: '#111',

	signals: [
		{
			name: 'shape',
			value: 'wedge',
			bind: { input: 'select', options: ['wedge', 'arrow'] }
		},
		{
			name: 'maxSize',
			value: 700,
			bind: { input: 'range', min: 50, max: 700, step: 10 }
		}
	],

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
			name: 'x',
			type: 'linear',
			range: 'width'
		},
		{
			name: 'y',
			type: 'linear',
			range: 'height'
		},
		{
			name: 'size',
			domain: { data: 'vectors', field: 'speed' },
			zero: true,
			range: [0, { signal: 'maxSize' }]
		},
		{
			name: 'color',
			domain: [0, 360],
			range: { scheme: 'rainbow' }
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
					angle: { field: 'dir', offset: 180 }
				},
				update: {
					shape: { signal: 'shape' },
					size: { scale: 'size', field: 'speed' }
				}
			}
		},
		{
			type: 'line',
			from: { data: 'points' },
			encode: {
				enter: {
					x: { scale: 'x', field: 'x' },
					y: { scale: 'y', field: 'y' },
					stroke: { value: '#fff' },
					strokeWidth: { value: 1 }
				}
			}
		}
	]
} as VisualizationSpec;
