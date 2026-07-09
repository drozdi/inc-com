import type { AxiosInstance } from 'axios';
import { $setting } from '../';
import { AxiosInterceptor } from '../utils/Axios-Interceptor';
export { queryClient } from './query-client';

export const api = new AxiosInterceptor({
	baseURL: $setting.get('URL_API'),
	message401: 'Signature has expired.',
	accessToken: 'token',
	refreshToken: 'refresh_token',
	accessTokenKey: $setting.get('ACCESS_TOKEN_KEY'),
	refreshTokenKey: $setting.get('REFRESH_TOKEN_KEY'),
	headers: {
		'Content-Type': 'application/json',
	},
	urlRefreshToken: async (refreshToken: string, axios: AxiosInstance) => {
		return (
			await axios.post('/token/refresh', {
				refresh_token: refreshToken,
			})
		).data;
	},
});
