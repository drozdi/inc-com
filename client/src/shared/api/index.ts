import { $setting } from '../';
import { AxiosInterceptor } from '../utils';
export { queryClient } from './query-client';

export const api = new AxiosInterceptor({
	baseURL: $setting.get('URL_API'),
	accessTokenKey: $setting.get('ACCESS_TOKEN_KEY'),
	refreshTokenKey: $setting.get('REFRESH_TOKEN_KEY'),
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
	},
});
