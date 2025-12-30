import type { QueryObserverBaseResult } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function useQueryLoading(...queries: any[]): boolean {
	return useMemo<boolean>(
		() => queries.some(query => query.isLoading),
		queries.map(query => query.isLoading)
	)
}
export function useQueryPending(...queries: any[]): boolean {
	return useMemo<boolean>(
		() => queries.some(query => query.isPending),
		queries.map(query => query.isPending)
	)
}
export function useQuerySuccess(...queries: any[]): boolean {
	return useMemo<boolean>(
		() => queries.some(query => query.isSuccess),
		queries.map(query => query.isSuccess)
	)
}

export function useQueryError(...queries: (IQuery | QueryObserverBaseResult)[]): IError {
	return useMemo<IError>(
		() => queries.reduce((acc: IError, query: IQuery) => acc || query.error, ''),
		[queries.map(query => query.error)]
	)
}

export function useQuery(
	queryKey: string[],
	queryFn: Function,
	{
		errorMes = 'Неизвестная ошибка',
		select,
		...props
	}: {
		errorMes?: string
		select?: Function
		[props: string]: any
	}
): IQuery {
	const queryClient = useQueryClient()
	const [error, setError] = useState<string>('')
	const [isLoading, setLoading] = useState<boolean>(false)
	const [data, setData] = useState<any>(null)
	return {
		data,
		isLoading,
		error,
		async fetch(query?: any) {
			setLoading(true)
			try {
				const res = await queryClient.fetchQuery({
					...props,
					queryKey: queryKey.concat(query),
					queryFn: async () => await queryFn(query),
				})
				setData(select?.(res) || res)
				return res
			} catch (error: IError) {
				setError(error?.response?.data?.detail || error?.message || errorMes)
			} finally {
				setLoading(false)
			}

			return undefined
		},
	}
}

export function useQueryList({
	queryKey,
	queryFn,
	select,
	params,
	...props
}: {
	queryKey: string[]
	queryFn: Function
	select?: Function
	params: Record<string, any>
}): IQuery {
	const [history, setHistory] = useState<Record<string, any>[]>([])

	const [query, setQuery] = useState(params)

	const queryClient = useQueryClient()
	const [data, setData] = useState<IEventsLogDoypack[]>([])

	const [isLoading, setLoading] = useState(false)
	const [hasNextPage, setHasNextPage] = useState(false)
	const hasPreviousPage = useMemo<boolean>(() => history.length > 0, [history])

	const fetchPreviousPage = useCallback(() => {
		setQuery(v => ({
			...v,
			...history.pop(),
		}))
		setHistory([...history])
	}, [history])

	const fetchNextPage = useCallback(() => {
		setHistory([...history, { ...params }])
		setQuery(v => ({ ...v }))
	}, [data])

	useEffect(() => {
		queryClient
			.fetchQuery({
				queryKey: queryKey.concat(query),
				queryFn: async () => {
					setLoading(true)
					const res = await queryFn(params)
					setLoading(false)
					return res
				},
			})
			.then(({ data }) => setData(data))
	}, [params])

	useEffect(() => {
		setHasNextPage(data.length === params.page_size)
	}, [data])

	return {
		data,
		isLoading,
		hasNextPage,
		hasPreviousPage,
		fetchPreviousPage,
		fetchNextPage,
	}
}
