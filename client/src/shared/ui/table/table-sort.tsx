import { Center, Group, keys, ScrollArea, Table, Text, TextInput, UnstyledButton } from '@mantine/core'
import { useMemo, useState } from 'react'
import { Icon } from '../icon'
import { Loading } from '../loading'
import classes from './table-sort.module.css'

interface ThProps {
	children: React.ReactNode
	reversed: boolean
	sorted: boolean
	onSort: () => void
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
	const icon = (
		<Icon size={16} stroke={1.5}>
			{sorted ? (reversed ? 'tb-chevron-up' : 'tb-chevron-down') : 'tb-selector'}
		</Icon>
	)
	return (
		<Table.Th className={classes.th}>
			<UnstyledButton onClick={onSort} className={classes.control}>
				<Group justify='space-between'>
					<Text fw={500} fz='sm' ta='center'>
						{children}
					</Text>
					<Center className={classes.icon}>{icon}</Center>
				</Group>
			</UnstyledButton>
		</Table.Th>
	)
}

function filterData<T>(data: T[], search: string): T[] {
	const query = search.toLowerCase().trim()
	return data.filter(item => keys(data?.[0] || {}).some(key => String(item[key]).toLowerCase().includes(query)))
}

function sortData<T>(data: T[], payload: { sortBy: keyof T | null; reversed: boolean; search: string }): T[] {
	const { sortBy } = payload

	if (!sortBy) {
		return filterData(data, payload.search)
	}

	return filterData(
		[...data].sort((a, b) => {
			if (payload.reversed) {
				return String(b[sortBy]).localeCompare(String(a[sortBy]))
			}

			return String(a[sortBy]).localeCompare(String(b[sortBy]))
		}),
		payload.search
	)
}

export function TableSort<T>({
	data = [],
	headers = [],
	children = 'Nothing found',
	isLoading = false,
	footer,
	onRowDbClick,
}: {
	data: T[]
	headers: {
		label: string
		field: keyof T
		cell?: (row: T, field: keyof T) => string | number | undefined
	}[]
	isLoading?: boolean
	children?: React.ReactNode
	footer?: React.ReactNode
	onRowDbClick?: (row: T) => void
}) {
	const [search, setSearch] = useState('')
	const [sortBy, setSortBy] = useState<keyof T | null>(null)
	const [reverseSortDirection, setReverseSortDirection] = useState(false)

	const setSorting = (field: keyof T) => {
		const reversed = field === sortBy ? !reverseSortDirection : false
		setReverseSortDirection(reversed)
		setSortBy(field)
	}

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget
		setSearch(value)
	}

	const sortedData = useMemo<T[]>(
		() => sortData<T>(data, { sortBy, reversed: reverseSortDirection, search }),
		[data, reverseSortDirection, sortBy, search]
	)

	const rows = useMemo(
		() =>
			sortedData.map((row, index) => (
				<Table.Tr key={index} onDoubleClick={() => onRowDbClick?.(row)}>
					{headers.map(({ field, cell }) => (
						<Table.Td key={field as string}>{cell?.(row, field) || row[field as keyof T]}</Table.Td>
					))}
				</Table.Tr>
			)),
		[sortedData, headers]
	)

	return (
		<ScrollArea>
			<Loading active={isLoading}>
				<TextInput
					placeholder='Search by any field'
					mb='md'
					leftSection={
						<Icon size={16} stroke={1.5}>
							tb-search
						</Icon>
					}
					value={search}
					onChange={handleSearchChange}
				/>
				<Table horizontalSpacing='md' verticalSpacing='xs' miw={700} layout='fixed'>
					<Table.Thead>
						<Table.Tr>
							{headers.map(({ label, field }) => (
								<Th
									key={field as string}
									sorted={sortBy === field}
									reversed={reverseSortDirection}
									onSort={() => setSorting(field)}
								>
									{label}
								</Th>
							))}
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{rows.length > 0 ? (
							rows
						) : (
							<Table.Tr>
								<Table.Td colSpan={headers.length}>
									<Text fw={500} ta='center'>
										{children}
									</Text>
								</Table.Td>
							</Table.Tr>
						)}
					</Table.Tbody>
					{footer && (
						<Table.Tfoot>
							<Table.Tr>
								<Table.Td colSpan={headers.length}>{footer}</Table.Td>
							</Table.Tr>
						</Table.Tfoot>
					)}
				</Table>
			</Loading>
		</ScrollArea>
	)
}
