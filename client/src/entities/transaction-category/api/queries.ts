import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseQueryOptions,
} from '@tanstack/react-query';
import { defaultCategory } from '../model/defaults';
import {
	requestCategoryCreate,
	requestCategoryDelete,
	requestCategoryList,
	requestCategoryRead,
	requestCategoryUpdate,
	type IRequestCategoryList,
} from './transaction-category';

const CATEGORIES_KEY = 'categories';

export function useTransactionCategoriesQuery(
	params: IRequestCategoryList = { limit: 100, offset: 0 },
	options?: Omit<
		UseQueryOptions<IResponseList<ICategory>>,
		'queryKey' | 'queryFn'
	>,
) {
	return useQuery({
		queryKey: [CATEGORIES_KEY, params],
		queryFn: () => requestCategoryList(params),
		...options,
	});
}

export function useTransactionCategoryQuery(id?: ICategory['id']) {
	return useQuery({
		queryKey: [CATEGORIES_KEY, id],
		queryFn: () =>
			id ? requestCategoryRead(id) : Promise.resolve(defaultCategory),
		enabled: !!id,
	});
}

export function useTransactionCategoryCreate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Partial<ICategory>) => requestCategoryCreate(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
		},
	});
}

export function useTransactionCategoryUpdate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			...data
		}: Partial<ICategory> & { id: ICategory['id'] }) =>
			requestCategoryUpdate(id, data),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
			queryClient.invalidateQueries({
				queryKey: [CATEGORIES_KEY, variables.id],
			});
		},
	});
}

export function useTransactionCategoryDelete() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: ICategory['id']) => requestCategoryDelete(id),
		onSuccess: (_data, id) => {
			queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
			queryClient.removeQueries({ queryKey: [CATEGORIES_KEY, id] });
		},
	});
}
