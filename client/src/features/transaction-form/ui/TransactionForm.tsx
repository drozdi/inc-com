import { useAccountsQuery } from '@/entities/account';
import {
	useTransactionCreate,
	useTransactionQuery,
	useTransactionUpdate,
	type ITransaction,
	type ITransactionPayload,
	type TransactionType,
} from '@/entities/transaction';
import { useTransactionCategoriesQuery } from '@/entities/transaction-category';
import { QrScannerModal } from '@/features/qr-scanner';
import type { ParsedFiscalQr } from '@/shared/lib/parse-fiscal-qr';
import { notification } from '@/shared/notification';
import { getErrorMessage } from '@/shared/utils/error';
import {
	Button,
	Group,
	NumberInput,
	Select,
	Stack,
	Switch,
	TextInput,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { TransactionItemsEditor } from './TransactionItemsEditor';

interface TransactionFormValues {
	type: TransactionType;
	accountId: string | null;
	categoryId: string | null;
	amount: number | string;
	date: Date | null;
	comment: string;
	isManualAmount: boolean;
	fn: string;
	fpd: string;
	fp: string;
	fd: string;
	items: Array<{ itemId: number; quantity: string; price: string }>;
}

interface TransactionFormProps {
	id?: ITransaction['id'];
	type?: TransactionType;
	defaultAccountId?: number;
	onSuccess?: (transaction: ITransaction) => void;
}

function toIsoDate(value: Date | null): string {
	return (value ?? new Date()).toISOString();
}

function toFormDate(value?: string | null): Date | null {
	if (!value) {
		return new Date();
	}
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function TransactionForm({
	id,
	type = 'expense',
	defaultAccountId,
	onSuccess,
}: TransactionFormProps) {
	const [qrOpened, setQrOpened] = useState(false);
	const isExpense = type === 'expense';

	const form = useForm<TransactionFormValues>({
		mode: 'uncontrolled',
		initialValues: {
			type,
			accountId: defaultAccountId ? String(defaultAccountId) : null,
			categoryId: null,
			amount: 0,
			date: new Date(),
			comment: '',
			isManualAmount: false,
			fn: '',
			fpd: '',
			fp: '',
			fd: '',
			items: [],
		},
		validate: {
			accountId: isNotEmpty('Выберите счёт'),
			categoryId: isNotEmpty('Выберите категорию'),
			date: (value) => (value ? null : 'Укажите дату'),
			amount: (value, values) => {
				if (!isExpense || values.isManualAmount) {
					return Number(value) > 0 ? null : 'Укажите сумму';
				}
				return null;
			},
		},
	});

	const accountId = form.values.accountId ? Number(form.values.accountId) : 0;

	const { data: accountsData } = useAccountsQuery();
	const { data: categoriesData } = useTransactionCategoriesQuery(
		{ accountId, limit: 100, offset: 0 },
		{ enabled: accountId > 0 },
	);
	const { data: transactionData } = useTransactionQuery(id);
	const createMutation = useTransactionCreate();
	const updateMutation = useTransactionUpdate();

	const accountOptions = useMemo(
		() =>
			(accountsData?.items ?? []).map((account) => ({
				value: String(account.id),
				label: account.label,
			})),
		[accountsData?.items],
	);

	const categoryOptions = useMemo(
		() =>
			(categoriesData?.items ?? [])
				.filter((category) => category.type === type)
				.map((category) => ({
					value: String(category.id),
					label: category.label,
				})),
		[categoriesData?.items, type],
	);

	useEffect(() => {
		if (!transactionData?.id || !id) {
			return;
		}

		form.setValues({
			type: transactionData.type,
			accountId: String(transactionData.accountId),
			categoryId: transactionData.categoryId
				? String(transactionData.categoryId)
				: null,
			amount: Number(transactionData.amount),
			date: toFormDate(transactionData.date),
			comment: transactionData.comment ?? '',
			isManualAmount: transactionData.isManualAmount,
			fn: transactionData.fn ?? '',
			fpd: transactionData.fpd ?? '',
			fp: transactionData.fp ?? '',
			fd: transactionData.fd ?? '',
			items: transactionData.items.map((item) => ({
				itemId: item.itemId,
				quantity: item.quantity,
				price: item.price,
			})),
		});
	}, [transactionData, id]);

	function applyQrData(data: ParsedFiscalQr) {
		if (data.fn) form.setFieldValue('fn', data.fn);
		if (data.fpd) form.setFieldValue('fpd', data.fpd);
		if (data.fp) form.setFieldValue('fp', data.fp);
		if (data.fd) form.setFieldValue('fd', data.fd);
		if (data.amount) form.setFieldValue('amount', Number(data.amount));
		if (data.date) form.setFieldValue('date', toFormDate(data.date));
	}

	function buildPayload(values: TransactionFormValues): ITransactionPayload {
		const payload: ITransactionPayload = {
			type,
			accountId: Number(values.accountId),
			categoryId: values.categoryId ? Number(values.categoryId) : null,
			date: toIsoDate(values.date),
			comment: values.comment || null,
		};

		if (isExpense) {
			payload.isManualAmount = values.isManualAmount;
			payload.fn = values.fn || null;
			payload.fpd = values.fpd || null;
			payload.fp = values.fp || null;
			payload.fd = values.fd || null;

			if (values.isManualAmount) {
				payload.amount = Number(values.amount).toFixed(2);
			} else {
				payload.items = values.items
					.filter((item) => item.itemId > 0)
					.map((item) => ({
						itemId: item.itemId,
						quantity: item.quantity,
						price: Number(item.price).toFixed(2),
					}));
			}
		} else {
			payload.amount = Number(values.amount).toFixed(2);
		}

		return payload;
	}

	async function handleSubmit(values: TransactionFormValues) {
		const payload = buildPayload(values);

		try {
			const result = id
				? await updateMutation.mutateAsync({ id, ...payload })
				: await createMutation.mutateAsync(payload);

			notification.success(
				id ? 'Транзакция обновлена' : 'Транзакция создана',
			);
			onSuccess?.(result);
		} catch (e: unknown) {
			const error = getErrorMessage(e, 'Не удалось сохранить транзакцию');
			notification.error('Ошибка', error);
		}
	}

	const loading = createMutation.isPending || updateMutation.isPending;
	const isManualAmount = form.values.isManualAmount;

	return (
		<>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack>
				<Select
					label="Счёт"
					data={accountOptions}
					key={form.key('accountId')}
					{...form.getInputProps('accountId')}
					searchable
					required
					w="100%"
				/>
				<Select
					label="Категория"
					data={categoryOptions}
					key={form.key('categoryId')}
					{...form.getInputProps('categoryId')}
					searchable
					required
					w="100%"
				/>
				<DateTimePicker
					label="Дата"
					key={form.key('date')}
					{...form.getInputProps('date')}
					required
					w="100%"
				/>
				{isExpense ? (
					<>
						<Group>
							<Button variant="light" onClick={() => setQrOpened(true)}>
								Сканировать QR
							</Button>
						</Group>
						<TextInput
							label="ФН"
							key={form.key('fn')}
							{...form.getInputProps('fn')}
							w="100%"
						/>
						<TextInput
							label="ФПД"
							key={form.key('fpd')}
							{...form.getInputProps('fpd')}
							w="100%"
						/>
						<TextInput
							label="ФП"
							key={form.key('fp')}
							{...form.getInputProps('fp')}
							w="100%"
						/>
						<TextInput
							label="ФД"
							key={form.key('fd')}
							{...form.getInputProps('fd')}
							w="100%"
						/>
						<Switch
							label="Ручной ввод суммы"
							key={form.key('isManualAmount')}
							{...form.getInputProps('isManualAmount', { type: 'checkbox' })}
						/>
						{isManualAmount ? (
							<NumberInput
								label="Сумма"
								decimalScale={2}
								min={0}
								key={form.key('amount')}
								{...form.getInputProps('amount')}
								required
								w="100%"
							/>
						) : (
							<TransactionItemsEditor
								items={form.values.items}
								onChange={(items) => form.setFieldValue('items', items)}
								disabled={loading}
							/>
						)}
					</>
				) : (
					<NumberInput
						label="Сумма"
						decimalScale={2}
						min={0}
						key={form.key('amount')}
						{...form.getInputProps('amount')}
						required
						w="100%"
					/>
				)}
				<TextInput
					label="Комментарий"
					key={form.key('comment')}
					{...form.getInputProps('comment')}
					w="100%"
				/>
				<Group>
					<Button type="submit" loading={loading} color="green">
						{id ? 'Сохранить' : 'Создать'}
					</Button>
				</Group>
				</Stack>
			</form>
			<QrScannerModal
				opened={qrOpened}
				onClose={() => setQrOpened(false)}
				onParsed={applyQrData}
			/>
		</>
	);
}
