import { useAccountsQuery } from '@/entities/account';
import {
	useTransferCreate,
	useTransferQuery,
	useTransferUpdate,
	type ITransfer,
	type ITransferPayload,
} from '@/entities/transfer';
import { notification } from '@/shared/notification';
import { getErrorMessage } from '@/shared/utils/error';
import {
	Button,
	Group,
	NumberInput,
	Select,
	Stack,
	TextInput,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { useEffect, useMemo } from 'react';

interface TransferFormValues {
	fromAccountId: string | null;
	toAccountId: string | null;
	amount: number | string;
	date: Date | null;
	comment: string;
}

interface TransferFormProps {
	id?: ITransfer['id'];
	onSuccess?: (transfer: ITransfer) => void;
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

export function TransferForm({ id, onSuccess }: TransferFormProps) {
	const form = useForm<TransferFormValues>({
		mode: 'uncontrolled',
		initialValues: {
			fromAccountId: null,
			toAccountId: null,
			amount: 0,
			date: new Date(),
			comment: '',
		},
		validate: {
			fromAccountId: isNotEmpty('Выберите счёт списания'),
			toAccountId: isNotEmpty('Выберите счёт зачисления'),
			amount: (value) => (Number(value) > 0 ? null : 'Укажите сумму'),
			date: (value) => (value ? null : 'Укажите дату'),
		},
	});

	const { data: accountsData } = useAccountsQuery();
	const { data: transferData } = useTransferQuery(id);
	const createMutation = useTransferCreate();
	const updateMutation = useTransferUpdate();

	const accountOptions = useMemo(
		() =>
			(accountsData?.items ?? []).map((account) => ({
				value: String(account.id),
				label: account.label,
			})),
		[accountsData?.items],
	);

	useEffect(() => {
		if (!transferData?.id || !id) {
			return;
		}

		form.setValues({
			fromAccountId: String(transferData.fromAccountId),
			toAccountId: String(transferData.toAccountId),
			amount: Number(transferData.amount),
			date: toFormDate(transferData.date),
			comment: transferData.comment ?? '',
		});
	}, [transferData, id]);

	async function handleSubmit(values: TransferFormValues) {
		if (values.fromAccountId === values.toAccountId) {
			notification.error('Ошибка', 'Счета должны отличаться');
			return;
		}

		const payload: ITransferPayload = {
			fromAccountId: Number(values.fromAccountId),
			toAccountId: Number(values.toAccountId),
			amount: Number(values.amount).toFixed(2),
			date: toIsoDate(values.date),
			comment: values.comment || null,
		};

		try {
			const result = id
				? await updateMutation.mutateAsync({ id, ...payload })
				: await createMutation.mutateAsync(payload);

			notification.success(id ? 'Перевод обновлён' : 'Перевод создан');
			onSuccess?.(result);
		} catch (e: unknown) {
			const error = getErrorMessage(e, 'Не удалось сохранить перевод');
			notification.error('Ошибка', error);
		}
	}

	const loading = createMutation.isPending || updateMutation.isPending;

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack>
			<Select
				label="Счёт списания"
				data={accountOptions}
				key={form.key('fromAccountId')}
				{...form.getInputProps('fromAccountId')}
				searchable
				required
				w="100%"
			/>
			<Select
				label="Счёт зачисления"
				data={accountOptions}
				key={form.key('toAccountId')}
				{...form.getInputProps('toAccountId')}
				searchable
				required
				w="100%"
			/>
			<NumberInput
				label="Сумма"
				decimalScale={2}
				min={0}
				key={form.key('amount')}
				{...form.getInputProps('amount')}
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
	);
}
