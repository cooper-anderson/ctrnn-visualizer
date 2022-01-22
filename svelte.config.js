import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		vite: {
			ssr: {
				noExternal: [/^@material\//, /^@smui(?:-extra)?\//],
			},
			optimizeDeps: {
				include: [
					"fast-deep-equal",
					"clone",
					"semver",
					"json-stringify-pretty-compact",
					"fast-json-stable-stringify",
				],
			}
		},
	}
};

export default config;
