import { queryClient } from '@/shared/api/query-client';
import { notification } from '@/shared/notification';
import { getterZustandMiddleware } from '@/shared/stores';
import { create } from 'zustand';
import {
	requestUserProfileDelete,
	requestUserProfileGet,
	requestUserProfileUpdate,
	requestUserProfileUpdatePassword,
} from '../api/user_profile';

export const useStoreUserProfile = create<IStoreUserProfile>(
	getterZustandMiddleware((set, get) => ({
		isLoading: false,
		error: '',
		userData: undefined,
		setUserData(data: IUser) {
			set({
				userData: {
					...get().userData,
					...data,
				},
			});
		},

		async load(reloading = false) {
			if (reloading) {
				queryClient.removeQueries({
					queryKey: ['user-profile'],
				});
			}
			set({
				isLoading: true,
				error: '',
			});
			try {
				const userData = await queryClient.fetchQuery({
					queryKey: ['user-profile'],
					queryFn: async () => {
						const response = await requestUserProfileGet();
						return response;
					},
				});

				set({
					isLoading: false,
					userData,
				});
				return userData;
			} catch (e: IError) {
				console.error(e);
				const error =
					e?.response?.data?.detail || e?.message || e || 'Неизвестная ошибка';
				set({
					isLoading: false,
					error,
				});
			}
			return undefined;
		},
		async update(userData: IUser) {
			set({
				isLoading: false,
				error: '',
			});
			try {
				const response = await requestUserProfileUpdate(userData);
				set({
					isLoading: false,
					userData: {
						...get().userData,
						...response.data,
					},
				});
				return response.data;
			} catch (e: IError) {
				console.error(e);
				const error =
					e.response?.data?.detail || e.message || 'Ошибка обновления';
				notification.error(error);
				set({
					isLoading: false,
					error,
				});
			}
			return undefined;
		},
		async updatePassword(oldPassword: string, newPassword: string) {
			set({
				isLoading: false,
				error: '',
			});

			try {
				const response = await requestUserProfileUpdatePassword(
					oldPassword,
					newPassword,
				);
				set({
					isLoading: false,
					userData: {
						...get().userData,
						...response.data,
					},
				});
				return true;
			} catch (e: IError) {
				console.log(e);
				const error =
					e.response?.data?.detail || e.message || 'Ошибка обновления';
				notification.error(error);
				set({
					isLoading: false,
					error,
				});
			}
			return false;
		},
		async delete() {
			set({
				isLoading: false,
				error: '',
			});
			try {
				const res = await requestUserProfileDelete();
				return res;
			} catch (e: IError) {
				console.log(e);
				const error = e.response?.data?.detail || e.message || 'Ошибка удаления';

				notification.error(error);
				set({
					isLoading: false,
					error,
				});
			}
		},
		reset() {
			set({
				userData: undefined,
			});
		},
	})),
);
