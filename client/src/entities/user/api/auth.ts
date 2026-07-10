import { api } from '@/shared/api';

import type { ApiUser } from '@/shared/types/api';

import type { IRegisterRequest } from '../model/types';



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



export async function requestAuthRegister(

	userData: IRegisterRequest,

): Promise<IResponse<ApiUser>> {

	const res = await api.post<ApiUser>('/auth/register', userData);

	return res.data;

}



export async function requestAuthMe(): Promise<IResponse<ApiUser>> {

	const res = await api.get<ApiUser>('/auth/me');

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



export function mapAuthMeToUser(data: ApiUser): IUser {

	const displayName = data.name ?? data.login ?? '';

	return {

		id: data.id,

		login: data.login,

		email: data.email,

		name: data.name ?? undefined,

		alias: displayName,

		first_name: displayName,

		second_name: '',

		patronymic: '',

		description: '',

		date_register: '',

		last_login: '',

		x_timestamp: '',

	};

}



export function mapRegisterResponseToUser(

	data: ApiUser,

	registerData: IRegisterRequest,

): IUser {

	return mapAuthMeToUser({

		...data,

		name: data.name ?? registerData.name,

	});

}

