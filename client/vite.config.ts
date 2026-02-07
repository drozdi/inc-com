import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@t': path.resolve(__dirname as any, './src/shared/layout'),
			'#test': path.resolve(__dirname, './test'),
			'#dev': path.resolve(__dirname, './dev'),
			'@': path.resolve(__dirname, './src'),
		},
	},
	plugins: [react(), tailwindcss(), tsconfigPaths()],
	server: {
		host: true,
		port: 2999,
	},
});
