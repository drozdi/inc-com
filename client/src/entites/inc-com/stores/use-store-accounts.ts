import { notification } from '@/shared/notification';
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
	load: async (reload = false) => {
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
				isLoading: false,
			});
		} catch (e: IError) {
			const error = e?.response?.detail || e?.message || e || 'Неизвестная ошибка';
			notification.error('Ошибка', error);
			set({
				error,
				isLoading: false,
			});
		}
	},
	findById: (id) => {
		get().load();
		return get().list.find((item) => item.id === id);
	},
	add: async (data) => {
		set({
			isLoading: true,
			error: '',
		});
		try {
			const res = await requestAccountCreate(data);
			notification.success('Успешно!', `Счет "${res.label}" успешно добавлен!`);
			set({
				list: [...get().list, res],
				isLoading: false,
			});
			return res;
		} catch (e: IError) {
			const error = e?.response?.detail || e?.message || e || 'Неизвестная ошибка';
			notification.error('Ошибка', error);
			set({
				error,
				isLoading: false,
			});
		}
		return undefined;
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
			set({ isLoading: false });
			return res;
		} catch (e: IError) {
			const error = e?.response?.detail || e?.message || e || 'Неизвестная ошибка';
			notification.error('Ошибка', error);
			set({
				error,
				isLoading: false,
			});
		}
		return undefined;
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
			set({ isLoading: false });
			notification.success('Успешно', `Счет "${res?.label}" обнавлен!`);
			return res;
		} catch (e: IError) {
			const error = e?.response?.detail || e?.message || e || 'Неизвестная ошибка';
			notification.error('Ошибка', error);
			set({
				error,
				isLoading: false,
			});
		}
		return undefined;
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
			notification.success('Успешно!', `Счет "${res?.label}" удален!`);
			set({
				list: get().list.filter((item) => item.id !== id),
				isLoading: false,
			});
			return res;
		} catch (e: IError) {
			const error = e?.response?.detail || e?.message || e || 'Неизвестная ошибка';
			notification.error('Ошибка', error);
			set({
				error,
				isLoading: false,
			});
		}
		return undefined;
	},
}));
