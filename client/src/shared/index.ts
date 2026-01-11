import { Setting } from './setting';

export const $setting = new Setting(
	{
		limit: 30,
		limits: ['15', '30', '50', '75', '100'],
		URL_API: 'http://localhost:8000/api',
		BASE_URL: '/',
		ACCESS_TOKEN_KEY: 'token.access',
		REFRESH_TOKEN_KEY: 'token.refresh',
		formatDate: 'DD.MM.YYYY',
		formatTime: 'HH:mm',
		formatTimeFull: 'HH:mm:ss',
		formatDateTime: '%formatDate% %formatTime%',
		formatDateTimeFull: '%formatDate% %formatTimeFull%',
		timeReload: 1000 * 60, // 1 минут
		timeNotification: 500, // 0.5 секунды
	},
	{
		URL_API: 'http://localhost:8000/api',
		BASE_URL: '/',
		ACCESS_TOKEN_KEY: '',
		REFRESH_TOKEN_KEY: '',
	},
	'inc-com',
);
