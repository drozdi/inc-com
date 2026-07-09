import { useTransactionCategoriesQuery } from '@/entities/transaction-category';
import {
	useTransactionsQuery,
	type ITransactionFilters,
} from '@/entities/transaction';
import { Anchor, Loader, ScrollArea, Table, Text } from '@mantine/core';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface TransactionTableWidgetProps {
	accountId: number;
	filters?: Omit<ITransactionFilters, 'accountId'>;
}

const TYPE_LABELS: Record<string, string> = {
	income: 'Доход',
	expense: 'Расход',
};

function formatDate(value: string): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	return date.toLocaleString('ru-RU');
}

export function TransactionTableWidget({
	accountId,
	filters = {},
}: TransactionTableWidgetProps) {
	const queryParams = useMemo(
		() => ({
			accountId,
			limit: 100,
			offset: 0,
			...filters,
		}),
		[accountId, filters],
	);

	const { data, isLoading } = useTransactionsQuery(queryParams);
	const { data: categoriesData } = useTransactionCategoriesQuery({
		accountId,
		limit: 100,
		offset: 0,
	});

	const categoryMap = useMemo(() => {
		const map = new Map<number, string>();
		for (const category of categoriesData?.items ?? []) {
			map.set(category.id, category.label);
		}
		return map;
	}, [categoriesData?.items]);

	const transactions = data?.items ?? [];

	if (isLoading) {
		return <Loader />;
	}

	if (!transactions.length) {
		return <Text c="dimmed">Транзакций нет</Text>;
	}

	return (
		<ScrollArea type="auto" offsetScrollbars>
			<Table striped highlightOnHover withTableBorder miw={600}>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Дата</Table.Th>
						<Table.Th>Тип</Table.Th>
						<Table.Th>Сумма</Table.Th>
						<Table.Th>Комментарий</Table.Th>
						<Table.Th>Категория</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{transactions.map((transaction) => (
						<Table.Tr key={transaction.id}>
							<Table.Td>{formatDate(transaction.date)}</Table.Td>
							<Table.Td>
								{TYPE_LABELS[transaction.type] ?? transaction.type}
							</Table.Td>
							<Table.Td>
								<Anchor
									component={Link}
									to={`/transactions/${transaction.id}/edit`}
								>
									{Number(transaction.amount).toLocaleString('ru-RU', {
										minimumFractionDigits: 2,
									})}
								</Anchor>
							</Table.Td>
							<Table.Td>{transaction.comment ?? '—'}</Table.Td>
							<Table.Td>
								{transaction.categoryId
									? (categoryMap.get(transaction.categoryId) ??
										transaction.categoryId)
									: '—'}
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</ScrollArea>
	);
}
