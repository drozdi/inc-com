import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseQueryOptions,
} from '@tanstack/react-query';
import { defaultItemCategory } from '../model/defaults';
import {
	requestItemCategoryCreate,
	requestItemCategoryDelete,
	requestItemCategoryList,
	requestItemCategoryRead,
	requestItemCategoryUpdate,
	type IRequestItemCategoryList,
} from './item-category';

const ITEM_CATEGORIES_KEY = 'item-categories';

export function useItemCategoriesQuery(
	params: IRequestItemCategoryList = { limit: 100, offset: 0 },
	options?: Omit<
		UseQueryOptions<IResponseList<IItemCategory>>,
		'queryKey' | 'queryFn'
	>,
) {
	return useQuery({
		queryKey: [ITEM_CATEGORIES_KEY, params],
		queryFn: () => requestItemCategoryList(params),
		...options,
	});
}

export function useItemCategoryQuery(id?: IItemCategory['id']) {
	return useQuery({
		queryKey: [ITEM_CATEGORIES_KEY, id],
		queryFn: () =>
			id
				? requestItemCategoryRead(id)
				: Promise.resolve(defaultItemCategory),
		enabled: !!id,
	});
}

export function useItemCategoryCreate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Partial<IItemCategory>) =>
			requestItemCategoryCreate(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [ITEM_CATEGORIES_KEY] });
		},
	});
}

export function useItemCategoryUpdate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			...data
		}: Partial<IItemCategory> & { id: IItemCategory['id'] }) =>
			requestItemCategoryUpdate(id, data),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: [ITEM_CATEGORIES_KEY] });
			queryClient.invalidateQueries({
				queryKey: [ITEM_CATEGORIES_KEY, variables.id],
			});
		},
	});
}

export function useItemCategoryDelete() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: IItemCategory['id']) =>
			requestItemCategoryDelete(id),
		onSuccess: (_data, id) => {
			queryClient.invalidateQueries({ queryKey: [ITEM_CATEGORIES_KEY] });
			queryClient.removeQueries({ queryKey: [ITEM_CATEGORIES_KEY, id] });
		},
	});
}
