import { type Axios } from 'axios';
import { $setting } from '../';
import { AxiosInterceptor } from '../utils';
export { queryClient } from './query-client';

export const api = new AxiosInterceptor({
	baseURL: $setting.get('URL_API'),
	message401: 'Signature has expired.',
	// message401: async (error) => {
	// 	console.log(error);
	// 	return [
	// 		'Signature has expired.',
	// 		'Expired JWT Token',
	// 		'Invalid JWT Refresh Token',
	// 	].includes(error.response.data.message);
	// },
	accessToken: 'token',
	refreshToken: 'refresh_token',
	accessTokenKey: $setting.get('ACCESS_TOKEN_KEY'),
	refreshTokenKey: $setting.get('REFRESH_TOKEN_KEY'),
	//timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
	},
	urlRefreshToken: async (refreshToken: string, axios: Axios) => {
		return (
			await axios.post('/token/refresh', {
				refresh_token: refreshToken,
			})
		).data;
	},
});
