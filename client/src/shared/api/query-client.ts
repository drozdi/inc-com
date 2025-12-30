import { QueryCache, QueryClient } from '@tanstack/react-query';

export const queryCache = new QueryCache({});
export const queryClient = new QueryClient({
	queryCache,
	defaultOptions: {
		queries: {
			staleTime: 'static',
			enabled: true,
			throwOnError: false,
			retry: false,
			gcTime: 1000 * 60 * 60,
		},
	},
});
