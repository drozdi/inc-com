import react from '@vitejs/plugin-react'
import path from 'path'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(() => {
	const env = loadEnv('development', process.cwd(), '')
	return {
		plugins: [react()],
		define: {
			// Указание явной константы уровня приложения, полученной из переменной окружения
			// __APP_ENV__: JSON.stringify(env.APP_ENV),
			__DEV__: env.NODE_ENV === 'development',
			__TEST__: env.NODE_ENV === 'test',
			__APP_VERSION__: JSON.stringify(`${env.npm_package_version}:${env.__VERSION__}`),
			__MM__: env.__MM__,
			__CM__: env.__CM__,
			__MM_QR__: env.__MM_QR__,
			__STEP__: env.__STEP__,
			__ROUND__: env.__ROUND__,
			__SNAP_THRESHOLD__: env.__SNAP_THRESHOLD__,
		},
		resolve: {
			preserveSymlinks: true,
			alias: {
				'#test': path.resolve(__dirname, './test'),
				'#dev': path.resolve(__dirname, './dev'),
				'@': path.resolve(__dirname, './src'),
			},
		},
		test: {
			environment: 'happy-dom',
			globals: true,
			setupFiles: ['./dev/vitest/vitest.setup.ts'],
			include: ['./src/**/*.{test,spec}.(c|m)?[tj]s(x)?', './src/**/__test__/**/*.(c|m)?[tj]s(x)?'],
			exclude: ['**\/node_modules/**', '**\/.git/**'],
			reporters: ['html', 'junit', 'json', 'verbose'],
			outputFile: {
				junit: './reports/junit-report.xml',
				json: './reports/json-report.json',
				html: './reports/html-report.html',
			},
			coverage: {
				include: ['./src'],
				reporter: ['text', 'json', 'html'],
				reportOnFailure: true,
				reportsDirectory: './reports/coverage',
			},
		},
	}
})
