import { api } from '../../../shared/api';

export async function requestCategoryList(
	params: Partial<IRequestList>,
): Promise<IResponseList<ICategory>> {
	return (await api.get('/inc-com/category/')).data;
}

export async function requestCategoryCreate({
	id,
	x_timestamp,
	...data
}: Partial<ICategory>): Promise<IResponse<ICategory>> {
	return (await api.post('/inc-com/category/', data)).data;
}

export async function requestCategoryRead(
	id: ICategory['id'],
): Promise<IResponse<ICategory>> {
	return (await api.get(`/inc-com/category/${id}`)).data;
}

export async function requestCategoryUpdate(
	id: ICategory['id'],
	{ x_timestamp, ...data }: Partial<ICategory>,
): Promise<IResponse<ICategory>> {
	return (await api.patch(`/inc-com/category/${id}`, data)).data;
}

export async function requestCategoryDelete(
	id: ICategory['id'],
): Promise<IResponse<ICategory>> {
	return (await api.delete(`/inc-com/category/${id}`)).data;
}
