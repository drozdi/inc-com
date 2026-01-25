export default {
	clearMocks: true,
	// testEnvironment: 'jsdom',
	testEnvironment: 'jsdom',
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
	coverageReporters: ['json', 'html'],
	coverageDirectory: '<rootDir>/reports/coverage',
	coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],
	moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
	moduleDirectories: ['node_modules'],
	modulePaths: ['<rootDir>/src'],
	rootDir: '../../',
	testMatch: ['<rootDir>/src/**/*(*.)@(spec|test).[tj]s?(x)', '<rootDir>/src/**/__test__/**/*.[tj]s?(x)'],
	setupFiles: ['jest-canvas-mock'],
	setupFilesAfterEnv: [
		//'@testing-library/jest-dom/extend-expect',
		'jest-canvas-mock',
		'<rootDir>/dev/jest/jest.global.ts',
		'jest-expect-message',
		'jest-extended',
		'jest-chain',
		'<rootDir>/dev/jest/jest.setup.ts',
	],
	globals: {
		'import.meta': { env: { DEV: true, PROD: false } },
		import: { meta: { env: { DEV: true, PROD: false } } },
	},
	moduleNameMapper: {
		'\\.s?css$': 'identity-obj-proxy',
		//'\\.svg': path.resolve(__dirname, 'jestEmptyComponent.tsx'),
		'^#test/(.*)$': '<rootDir>/test/$1',
		'^#test': '<rootDir>/test',
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	transformIgnorePatterns: ['node_modules/(?!axios)'],
	reporters: [
		'default',
		[
			'jest-html-reporters',
			{
				publicPath: '<rootDir>/reports/jest',
				filename: 'report.html',
				inlineSource: true,
			},
		],
	],
	transform: {
		'^.+\\.(t|j)sx?$': [
			'babel-jest',
			{
				plugins: [
					[
						'babel-plugin-transform-import-meta',
						{
							module: 'ES6',
						},
					],
				],
				presets: [
					['@babel/preset-env', { targets: { node: 'current' } }],
					['@babel/preset-react', { runtime: 'automatic' }], // Важно!
				],
			},
		],
	},
}
