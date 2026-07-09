import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'#test': path.resolve(__dirname, './test'),
			'#dev': path.resolve(__dirname, './dev'),
			'@/app': path.resolve(__dirname, './src/app'),
			'@/pages': path.resolve(__dirname, './src/pages'),
			'@/layouts': path.resolve(__dirname, './src/layouts'),
			'@/widgets': path.resolve(__dirname, './src/widgets'),
			'@/features': path.resolve(__dirname, './src/features'),
			'@/entities': path.resolve(__dirname, './src/entities'),
			'@/shared': path.resolve(__dirname, './src/shared'),
			'@': path.resolve(__dirname, './src'),
		},
	},
	plugins: [react(), tailwindcss(), tsconfigPaths()],
	server: {
		host: true,
		port: 2999,
	},
});
