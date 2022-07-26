import type { VisualizationSpec } from 'vega-embed';

export default {
	$schema: 'https://vega.github.io/schema/vega/v5.json',
	description: 'A basic line chart example.',
	width: 2 * 770,
	height: 770,
	padding: 5,

	signals: [
		{
			name: 'interpolate',
			value: 'linear',
			bind: {
				input: 'select',
				options: [
					'basis',
					'cardinal',
					'catmull-rom',
					'linear',
					'monotone',
					'natural',
					'step',
					'step-after',
					'step-before'
				]
			}
		}
	],

	data: [
		{
			name: 'table'
		}
	],

	scales: [
		{
			name: 'x',
			type: 'point',

			range: 'width',
			domain: { data: 'table', field: 'x' }
		},
		{
			name: 'y',
			type: 'linear',
			range: 'height',
			nice: true,
			zero: true,
			domain: { data: 'table', field: 'y' }
		},
		{
			name: 'color',
			type: 'ordinal',
			range: 'category',
			domain: { data: 'table', field: 'c' }
		}
	],

	axes: [
		{
			orient: 'bottom',
			scale: 'x',
			labelColor: '#ffffff',
			labelOverlap: true,
			labelSeparation: 100
		},
		{ orient: 'left', scale: 'y', labelColor: '#ffffff' }
	],

	marks: [
		{
			type: 'group',
			from: {
				facet: {
					name: 'series',
					data: 'table',
					groupby: 'c'
				}
			},

			marks: [
				{
					type: 'line',
					from: { data: 'series' },
					encode: {
						enter: {
							x: { scale: 'x', field: 'x' },
							y: { scale: 'y', field: 'y' },
							stroke: { scale: 'color', field: 'c' },
							strokeWidth: { value: 2 }
						},
						update: {
							interpolate: { signal: 'interpolate' },
							strokeOpacity: { value: 1 },
							x: { scale: 'x', field: 'x' },
							y: { scale: 'y', field: 'y' },
							stroke: { scale: 'color', field: 'c' }
						},
						hover: {
							strokeOpacity: { value: 0.5 }
						}
					}
				}
			]
		}
	]
} as VisualizationSpec;