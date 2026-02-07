import { api } from '@/shared/api';

export async function requestAuthenticationLogin(credentials: {
	username: string;
	password: string;
}): Promise<
	IResponse<{
		token: string;
		refresh_token: string;
	}>
> {
	const res = await api.post('/login', credentials);
	return res.data;
}
export async function requestAuthenticationRegister(userData: IUser) {
	const res = await api.post('/registration/save_data', userData);
	return res.data;
}
export async function requestAuthenticationRefresh(refreshToken: string): Promise<
	IResponse<{
		token: {
			access: string;
			refresh: string;
		};
	}>
> {
	const res = await api.post('/token/refresh', {
		refresh_token: refreshToken,
	});
	return res.data;
}
