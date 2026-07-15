import { useTransactionCategoriesQuery } from '@/entities/transaction-category';
import {
	useTransactionsQuery,
	type ITransaction,
	type ITransactionFilters,
} from '@/entities/transaction';
import { DataColumn, TableData } from '@/shared/ui/table';
import { Anchor, ScrollArea } from '@mantine/core';
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

function getTransactionEditPath(transaction: ITransaction): string {
	if (transaction.transferId) {
		return `/transfers/${transaction.transferId}/edit`;
	}
	return `/transactions/${transaction.id}/edit`;
}

function formatDate(value: string): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	return date.toLocaleString('ru-RU');
}

function formatTransactionType(transaction: ITransaction): string {
	if (transaction.transferId) {
		return 'Перевод';
	}
	return TYPE_LABELS[transaction.type] ?? transaction.type;
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

	return (
		<ScrollArea type="auto" offsetScrollbars>
			<TableData<ITransaction>
				data={transactions}
				loading={isLoading}
				withPagination={false}
				withTableBorder
				storage={`transactions.list.${accountId}`}
				noDataText="Транзакций нет"
				miw={600}
				w="100%"
			>
				<DataColumn<ITransaction>
					field="date"
					header="Дата"
					sortable
					resizable
					body={(transaction) => formatDate(transaction.date)}
				/>
				<DataColumn<ITransaction>
					field="type"
					header="Тип"
					sortable
					resizable
					body={(transaction) => formatTransactionType(transaction)}
				/>
				<DataColumn<ITransaction>
					field="amount"
					header="Сумма"
					sortable
					align="right"
					resizable
					body={(transaction) => (
						<Anchor
							component={Link}
							to={getTransactionEditPath(transaction)}
						>
							{Number(transaction.amount).toLocaleString('ru-RU', {
								minimumFractionDigits: 2,
							})}
						</Anchor>
					)}
				/>
				<DataColumn<ITransaction>
					field="comment"
					header="Комментарий"
					sortable
					resizable
					ellipsis
					body={(transaction) => transaction.comment ?? '—'}
				/>
				<DataColumn<ITransaction>
					field="categoryId"
					header="Категория"
					sortable
					resizable
					body={(transaction) =>
						transaction.categoryId
							? (categoryMap.get(transaction.categoryId) ??
								transaction.categoryId)
							: '—'
					}
				/>
			</TableData>
		</ScrollArea>
	);
}
