import type { ComboboxItem } from '@mantine/core';
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

export function factoryQuery<
	T extends { id?: number; label?: string },
	RL extends IRequestList,
>(
	entry: string,
	defaultEntry: T,
	requestList: (params: Partial<RL>) => Promise<IResponseList<T>>,
	requestRead: (id: T['id']) => Promise<IResponse<T>>,
	requestCreate: (data: T | Partial<T>) => Promise<IResponse<T>>,
	requestUpdate: (id: T['id'], data: T | Partial<T>) => Promise<IResponse<T>>,
	requestDelete?: (id: T['id']) => Promise<IResponse<T>>,
) {
	return [
		requestList &&
			function useQueryList(params: Partial<RL>) {
				params.limit = params.limit || 100;
				const q = useInfiniteQuery({
					queryKey: [entry, { ...params, offset: undefined }],
					initialPageParam: 0,
					queryFn: async ({ pageParam }) => {
						const res = await requestList({ ...params, offset: pageParam });
						return res;
					},
					getNextPageParam: (lastPage) => {
						return lastPage.next || undefined;
					},
					getPreviousPageParam: (lastPage) => {
						//return lastPage.pref || undefined;
					},
					select({ pages, pageParams }): T[] {
						return pages[pageParams[pageParams.length - 1]].items;
					},
				});
				const dataSelect = useMemo<ComboboxItem[]>(
					() =>
						(q.data || []).map((item) => ({
							value: String(item.id),
							label: item?.label as string,
						})),
					[q.data],
				);
				const findLabelById = useCallback(
					(id: T['id']) => {
						if (id) {
							const item = q.data?.find((item) => item.id === id);
							return item?.label;
						}
					},
					[q.data],
				);
				return {
					...q,
					dataSelect,
					findLabelById,
				};
			},
		requestRead &&
			function useQueryRead(id: T['id']) {
				return useQuery({
					queryKey: [entry, id],
					queryFn: async () =>
						id ? await requestRead(id) : { data: defaultEntry },
				});
			},
		requestCreate &&
			function useQueryCreate() {
				const queryClient = useQueryClient();
				return useMutation({
					mutationFn: async (data: T | Partial<T>) => {
						return await requestCreate(data);
					},
					onSuccess: (data, {}) => {
						queryClient.invalidateQueries({ queryKey: [entry] });
					},
				});
			},
		requestUpdate &&
			function useQueryUpdate() {
				const queryClient = useQueryClient();
				return useMutation({
					mutationFn: async ({ id, ...data }: T | Partial<T>) => {
						return await requestUpdate(id, data as T);
					},
					onSuccess: (data, {}) => {
						queryClient.removeQueries({ queryKey: [entry] });
						// queryClient.invalidateQueries({ queryKey: [entry] })
					},
				});
			},
		requestDelete &&
			function useQueryDelete() {
				const queryClient = useQueryClient();
				return useMutation({
					mutationFn: async ({ id }: T | Partial<T>) => {
						return await requestDelete(id);
					},
					onSuccess: (data, {}) => {
						queryClient.invalidateQueries({ queryKey: [entry] });
					},
				});
			},
	];
}
