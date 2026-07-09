import type { TransactionType } from '@/entities/transaction';
import { TransactionForm } from '@/features/transaction-form';
import { TransferForm } from '@/features/transfer-form';
import { Template } from '@/layouts';
import { TransactionTableWidget } from '@/widgets';
import { Button, Group, Select, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

export function TransactionsListPage() {
	const { id } = useParams();
	const accountId = Number(id);
	const [typeFilter, setTypeFilter] = useState<string | null>(null);
	const [dateFrom, setDateFrom] = useState<Date | null>(null);
	const [dateTo, setDateTo] = useState<Date | null>(null);

	const filters = useMemo(() => {
		const result: {
			type?: TransactionType;
			dateFrom?: string;
			dateTo?: string;
		} = {};
		if (typeFilter === 'income' || typeFilter === 'expense') {
			result.type = typeFilter;
		}
		if (dateFrom) {
			result.dateFrom = dateFrom.toISOString();
		}
		if (dateTo) {
			result.dateTo = dateTo.toISOString();
		}
		return result;
	}, [typeFilter, dateFrom, dateTo]);

	return (
		<>
			<Template.Title>Транзакции</Template.Title>
			<Stack gap="md">
				<Stack gap="md" hiddenFrom="sm">
					<Select
						label="Тип"
						placeholder="Все"
						clearable
						data={[
							{ value: 'income', label: 'Доход' },
							{ value: 'expense', label: 'Расход' },
						]}
						value={typeFilter}
						onChange={setTypeFilter}
					/>
					<DatePickerInput
						label="С"
						clearable
						value={dateFrom}
						onChange={(value) => setDateFrom(value as Date | null)}
					/>
					<DatePickerInput
						label="По"
						clearable
						value={dateTo}
						onChange={(value) => setDateTo(value as Date | null)}
					/>
					<Group grow>
						<Button
							component={Link}
							to={`/accounts/${accountId}/transactions/new?type=income`}
							color="green"
						>
							Доход
						</Button>
						<Button
							component={Link}
							to={`/accounts/${accountId}/transactions/new?type=expense`}
							color="red"
						>
							Расход
						</Button>
						<Button
							component={Link}
							to={`/accounts/${accountId}/transfers/new`}
							variant="light"
						>
							Перевод
						</Button>
					</Group>
				</Stack>
				<Group justify="space-between" wrap="wrap" visibleFrom="sm">
					<Group wrap="wrap">
						<Select
							label="Тип"
							placeholder="Все"
							clearable
							data={[
								{ value: 'income', label: 'Доход' },
								{ value: 'expense', label: 'Расход' },
							]}
							value={typeFilter}
							onChange={setTypeFilter}
							w={160}
						/>
						<DatePickerInput
							label="С"
							clearable
							value={dateFrom}
							onChange={(value) => setDateFrom(value as Date | null)}
							w={160}
						/>
						<DatePickerInput
							label="По"
							clearable
							value={dateTo}
							onChange={(value) => setDateTo(value as Date | null)}
							w={160}
						/>
					</Group>
					<Group mt={24}>
						<Button
							component={Link}
							to={`/accounts/${accountId}/transactions/new?type=income`}
							color="green"
						>
							Доход
						</Button>
						<Button
							component={Link}
							to={`/accounts/${accountId}/transactions/new?type=expense`}
							color="red"
						>
							Расход
						</Button>
						<Button
							component={Link}
							to={`/accounts/${accountId}/transfers/new`}
							variant="light"
						>
							Перевод
						</Button>
					</Group>
				</Group>
				<TransactionTableWidget accountId={accountId} filters={filters} />
			</Stack>
		</>
	);
}

export function TransactionCreatePage() {
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const accountId = Number(id);
	const type = (searchParams.get('type') as TransactionType) ?? 'expense';
	const isIncome = type === 'income';

	return (
		<>
			<Template.Title>{isIncome ? 'Новый доход' : 'Новый расход'}</Template.Title>
			<TransactionForm
				type={type}
				defaultAccountId={accountId}
				onSuccess={() => navigate(`/accounts/${accountId}/transactions`)}
			/>
		</>
	);
}

export function TransactionEditPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const transactionId = Number(id);

	return (
		<>
			<Template.Title>Редактирование транзакции</Template.Title>
			<TransactionForm
				id={transactionId}
				onSuccess={(transaction) =>
					navigate(`/accounts/${transaction.accountId}/transactions`)
				}
			/>
		</>
	);
}

export function TransferCreatePage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const accountId = Number(id);

	return (
		<>
			<Template.Title>Новый перевод</Template.Title>
			<TransferForm
				onSuccess={() => navigate(`/accounts/${accountId}/transactions`)}
			/>
		</>
	);
}
