import { api } from '@/shared/api';
import { notification } from '@/shared/notification';
import { getterZustandMiddleware } from '@/shared/stores';
import { create } from 'zustand';
import { requestAuthenticationLogin } from '../api/authentication';

export const useStoreAuth = create<IStoreAuth>(
	getterZustandMiddleware((set, get) => ({
		error: '',
		isLoading: false,
		isAuthenticated: false,
		get isAuth() {
			return !!api.getRefreshToken() && !!api.getAccessToken();
		},
		clearAuth() {
			set({
				isAuthenticated: false,
			});
			api.clearTokens();
		},
		async load() {
			const isAuthenticated = !!api.getRefreshToken() && !!api.getAccessToken();
			set({
				isAuthenticated,
			});
			if (!isAuthenticated) {
				api.clearTokens();
			}
		},
		async login(username, password) {
			set({
				isLoading: true,
				error: '',
			});
			try {
				const response = await requestAuthenticationLogin({
					username,
					password,
				});
				api.setAccessToken(response.token);
				api.setRefreshToken(response.refresh_token);
				set({
					isAuthenticated: true,
					isLoading: false,
				});
				return true;
			} catch (e: IError) {
				console.error(e);
				const error = e.response?.data?.detail || e?.message || 'Ошибка входа';
				notification.error(error);
				set({
					isLoading: false,
					error,
				});
			}
			return false;
		},
		async logout() {
			get().clearAuth();
		},
	})),
);
