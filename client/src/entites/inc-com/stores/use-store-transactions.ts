import { queryClient } from '@/shared/api/query-client';
import { notification } from '@/shared/notification';
import { create } from 'zustand';
import {
	requestCategoryCreate,
	requestCategoryDelete,
	requestCategoryList,
	requestCategoryRead,
	requestCategoryUpdate,
} from '../api/request-category';

export const useStoreTransactions = create<IStoreTransaction>((set, get) => ({
	isLoading: false,
	error: '',
	list: [],
	load: async (reload = false) => {
		if (reload) {
			queryClient.removeQueries({
				queryKey: ['categories'],
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
			let categories: ICategory[] = [];
			let res;
			do {
				res = await queryClient.fetchQuery({
					queryKey: ['categories', params],
					queryFn: async () => await requestCategoryList(params),
				});
				categories = [...categories, ...res.items];
				params.offset = params.offset + 1;
			} while (res?.items?.length >= params.limit);

			set({
				list: categories,
				isLoading: false,
			});
		} catch (error: IError) {
			console.error(error);
			set({
				isLoading: false,
				error:
					error?.response?.detail ||
					error?.message ||
					error ||
					'Неизвестная ошибка',
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
				queryKey: ['categories', id],
				queryFn: async () => await requestCategoryRead(id),
			});
			set({ isLoading: false });
			return res;
		} catch (e: IError) {
			const error = e?.response?.detail || e?.message || e || 'Неизвестная ошибка';
			set({
				error,
				isLoading: false,
			});
			notification.error('Ошибка', error);
		}
		return undefined;
	},
	update: async (id, data) => {
		set({
			isLoading: true,
			error: '',
		});
		const category = get().findById(id);
		try {
			const res = await requestCategoryUpdate(id, data);
			queryClient.setQueryData(['categories', id], res);
			queryClient.resetQueries({
				queryKey: ['categories'],
			});

			notification.success(
				'Успешно',
				`Категория "${category?.label}" переминована в ${res.label} ${res.mcc ? ` с кодом ${res.mcc}` : ''}!`,
			);

			set({
				isLoading: false,
			});
			return res;
		} catch (e: IError) {
			const error = e?.response?.detail || e?.message || e || 'Неизвестная ошибка';
			set({
				error,
				isLoading: false,
			});
			notification.error('Ошибка', error);
		}
		return undefined;
	},
	add: async (data) => {
		set({
			isLoading: true,
			error: '',
		});
		try {
			const res = await requestCategoryCreate(data);
			set({
				list: [...get().list, res],
				isLoading: false,
			});
			notification.success(
				'Успешно!',
				`Категория "${res.label}" успешна добавлена!`,
			);
			return res;
		} catch (e: IError) {
			const error = e?.response?.detail || e?.message || e || 'Неизвестная ошибка';
			set({
				error,
				isLoading: false,
			});
			notification.error('Ошибка', error);
		}
		return undefined;
	},
	delete: async (id) => {
		set({
			isLoading: true,
			error: '',
		});
		try {
			const res = await requestCategoryDelete(id);
			queryClient.removeQueries({
				queryKey: ['categories', id],
			});
			queryClient.resetQueries({
				queryKey: ['categories'],
			});
			notification.success('Успешно!', `Категория "${res?.label}" удалена`);
			set({
				list: get().list.filter((item) => item.id !== res.id),
				isLoading: false,
			});
			return res;
		} catch (e: IError) {
			const error = e?.response?.detail || e?.message || e || 'Неизвестная ошибка';
			set({
				error,
				isLoading: false,
			});
			notification.error('Ошибка', error);
		}
		return undefined;
	},
	findById: (id) => {
		get().load();
		return get().list.find((item) => item.id === id);
	},
}));
