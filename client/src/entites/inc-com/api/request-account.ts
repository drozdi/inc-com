import { api } from '../../../shared/api';

export async function requestAccountList(
	params: Partial<IRequestList>,
): Promise<IResponseList<IAccount>> {
	return (await api.get('/inc-com/account/')).data;
}

export async function requestAccountCreate({
	id,
	x_timestamp,
	...data
}: Partial<IAccount>): Promise<IResponse<IAccount>> {
	return (await api.post('/inc-com/account/', data)).data;
}

export async function requestAccountRead(
	id: IAccount['id'],
): Promise<IResponse<IAccount>> {
	return (await api.get(`/inc-com/account/${id}`)).data;
}

export async function requestAccountUpdate(
	id: IAccount['id'],
	{ x_timestamp, ...data }: Partial<IAccount>,
): Promise<IResponse<IAccount>> {
	return (await api.patch(`/inc-com/account/${id}`, data)).data;
}

export async function requestAccountDelete(
	id: IAccount['id'],
): Promise<IResponse<IAccount>> {
	return (await api.delete(`/inc-com/account/${id}`)).data;
}
