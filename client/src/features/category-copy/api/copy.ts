import { api } from '@/shared/api';

export interface ICategoryCopyRequest {
	targetAccountId: number;
	type?: 'income' | 'expense' | 'transfer';
	categoryIds?: number[];
}

export interface ICategoryCopySkipped {
	name: string;
	reason: string;
}

export interface ICategoryCopyResponse {
	copied: number;
	skipped: ICategoryCopySkipped[];
}

export async function requestCategoryCopy(
	fromAccountId: number,
	data: ICategoryCopyRequest,
): Promise<ICategoryCopyResponse> {
	const res = await api.post<ICategoryCopyResponse>(
		`/accounts/${fromAccountId}/categories/copy`,
		data,
	);
	return res.data;
}
