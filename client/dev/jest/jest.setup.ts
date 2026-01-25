// Такой файл вы могли наблюдать при create-react-app
import '@testing-library/dom'
import '@testing-library/jest-dom'
import '@testing-library/react'
import 'regenerator-runtime/runtime'

// jest.setup.js

// Мокаем import.meta глобально
const mockImportMeta = {
	env: {
		// Определяем режим
		DEV: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test',
		PROD: process.env.NODE_ENV === 'production',
		MODE: process.env.NODE_ENV || 'test',

		// Загружаем VITE_ переменные
		VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:3000',
		VITE_APP_NAME: process.env.VITE_APP_NAME || 'Test App',
		// Добавьте другие переменные
	},

	// Другие свойства
	url: 'file:///mocked/url',

	// Методы
	glob: () => ({}),
	globEager: () => ({}),
	globSync: () => ({}),
}

// Присваиваем в зависимости от версии Node.js
if (typeof global !== 'undefined') {
	global.import = { meta: mockImportMeta }
}

if (typeof globalThis !== 'undefined') {
	globalThis.import = { meta: mockImportMeta }
}

// Также мокаем глобально для Jest
globalThis.import_meta = mockImportMeta
