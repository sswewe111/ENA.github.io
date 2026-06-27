// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import rehypeKatex from 'rehype-katex';
import remarkDisplayMath from './src/config/remarkDisplayMath.mjs';
import remarkMath from 'remark-math';
import remarkWikiLinks from './src/config/remarkWikiLinks.mjs';

const dynamicMode = process.env.ATLAS_DYNAMIC === 'true';
const adapter = dynamicMode ? (await import('@astrojs/node')).default({ mode: 'standalone' }) : undefined;
const base = '/ENA.github.io';
process.env.ATLAS_BASE = base;

// https://astro.build/config
export default defineConfig({
	site: 'https://sswewe111.github.io',
	base,
	output: dynamicMode ? 'server' : 'static',
	adapter,
	markdown: {
		remarkPlugins: [remarkMath, remarkDisplayMath, remarkWikiLinks],
		rehypePlugins: [rehypeKatex],
	},
	i18n: {
		defaultLocale: 'zh',
		locales: ['zh', 'en'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
