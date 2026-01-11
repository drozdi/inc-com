import { create } from 'zustand';
import { queryClient } from '../../../shared/api/query-client';
import {
	requestAccountCreate,
	requestAccountDelete,
	requestAccountList,
	requestAccountRead,
	requestAccountUpdate,
} from '../api/request-account';

export const useStoreAccounts = create<IStoreAccount>((set, get) => ({
	isLoading: false,
	error: '',
	list: [],
	fetch: async (reload = false) => {
		if (reload) {
			queryClient.removeQueries({
				queryKey: ['accounts'],
			});
		}
		set({
			isLoading: true,
			error: '',
		});
		const params: IRequestList = {
			limit: 100,
			offset: 0,
		};
		try {
			let accounts: IAccount[] = [];
			let res;
			do {
				res = await queryClient.fetchQuery({
					queryKey: ['accounts', params],
					queryFn: async () => await requestAccountList(params),
				});
				accounts = [...accounts, ...res.items];
				params.offset = params.offset + 1;
			} while (res?.items?.length >= params.limit);

			set({
				list: accounts,
			});
		} catch (error: IError) {
			console.error(error);
			set({
				error:
					error?.response?.detail ||
					error?.message ||
					error ||
					'Неизвестная ошибка',
			});
		} finally {
			set({
				isLoading: false,
			});
		}
	},
	findById: (id) => {
		get().fetch();
		return get().list.find((item) => item.id === id);
	},
	add: async (data) => {
		set({
			isLoading: true,
			error: '',
		});
		try {
			const res = await requestAccountCreate(data);
			set({
				list: [...get().list, res],
				isLoading: false,
			});
			return res;
		} catch (error: IError) {
			set({
				error:
					error?.response?.detail ||
					error?.message ||
					error ||
					'Неизвестная ошибка',
				isLoading: false,
			});
		}
	},
	detail: async (id) => {
		set({
			isLoading: true,
			error: '',
		});
		try {
			const res = await queryClient.fetchQuery({
				queryKey: ['accounts', id],
				queryFn: async () => await requestAccountRead(id),
			});
			return res;
		} catch (error: IError) {
			set({
				error:
					error?.response?.detail ||
					error?.message ||
					error ||
					'Неизвестная ошибка',
			});
		} finally {
			set({
				isLoading: false,
			});
		}
	},
	update: async (id, data) => {
		set({
			isLoading: true,
			error: '',
		});
		try {
			const res = await requestAccountUpdate(id, data);
			queryClient.setQueryData(['accounts', id], res);
			queryClient.resetQueries({
				queryKey: ['accounts'],
			});
			return res;
		} catch (error: IError) {
			set({
				error:
					error?.response?.detail ||
					error?.message ||
					error ||
					'Неизвестная ошибка',
			});
		} finally {
			set({
				isLoading: false,
			});
		}
	},
	delete: async (id) => {
		set({
			isLoading: true,
			error: '',
		});
		try {
			const res = await requestAccountDelete(id);
			queryClient.removeQueries({
				queryKey: ['accounts', id],
			});
			queryClient.resetQueries({
				queryKey: ['accounts'],
			});
			set({
				list: get().list.filter((item) => item.id !== id),
			});
			return res;
		} catch (error: IError) {
			set({
				error:
					error?.response?.detail ||
					error?.message ||
					error ||
					'Неизвестная ошибка',
			});
		} finally {
			set({
				isLoading: false,
			});
		}
	},
}));
