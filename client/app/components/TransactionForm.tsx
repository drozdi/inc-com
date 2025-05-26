// components/TransactionForm.tsx
import { Box, Button, Group, NumberInput, Select, TextInput } from '@mantine/core';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useCategoryStore } from '../stores/categoryStore';
import { useTransactionStore } from '../stores/transactionStore';

interface TransactionFormValues {
	type: 'income' | 'expense';
	amount: number;
	categoryId: string;
	items: Array<{
		name: string;
		amount: number;
		categoryId: string;
	}>;
}

export const TransactionForm = ({ accountId }: { accountId: string }) => {
	const { addTransaction } = useTransactionStore();
	const { getCategoriesTree } = useCategoryStore();
	const [transactionType, setTransactionType] = useState<'income' | 'expense'>(
		'expense',
	);

	const { control, register, handleSubmit, watch } = useForm<TransactionFormValues>({
		defaultValues: {
			type: 'expense',
			amount: 0,
			items: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'items',
	});

	const incomeCategories = getCategoriesTree('income');
	const expenseCategories = getCategoriesTree('expense');
	const productCategories = getCategoriesTree('product');

	const onSubmit = (data: TransactionFormValues) => {
		addTransaction({
			...data,
			accountId,
			date: new Date().toISOString(),
			createdBy: 'currentUserId', // Заменить на реальный ID из authStore
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Select
				label="Transaction Type"
				data={[
					{ value: 'income', label: 'Income' },
					{ value: 'expense', label: 'Expense' },
				]}
				{...register('type')}
				onChange={(value) => setTransactionType(value as 'income' | 'expense')}
			/>

			<NumberInput label="Amount" precision={2} {...register('amount')} />

			<Select
				label="Category"
				data={
					transactionType === 'income'
						? incomeCategories.map((c) => ({ value: c.id, label: c.name }))
						: expenseCategories.map((c) => ({ value: c.id, label: c.name }))
				}
				{...register('categoryId')}
			/>

			{transactionType === 'expense' && (
				<Box mt="md">
					<Group position="apart">
						<h4>Items</h4>
						<Button
							size="sm"
							onClick={() =>
								append({ name: '', amount: 0, categoryId: '' })
							}
						>
							Add Item
						</Button>
					</Group>

					{fields.map((field, index) => (
						<Group key={field.id}>
							<TextInput
								placeholder="Item name"
								{...register(`items.${index}.name`)}
							/>
							<NumberInput
								placeholder="Amount"
								precision={2}
								{...register(`items.${index}.amount`)}
							/>
							<Select
								placeholder="Category"
								data={productCategories.map((c) => ({
									value: c.id,
									label: c.name,
								}))}
								{...register(`items.${index}.categoryId`)}
							/>
							<Button color="red" onClick={() => remove(index)}>
								Remove
							</Button>
						</Group>
					))}
				</Box>
			)}

			<Button type="submit" mt="md">
				Create Transaction
			</Button>
		</form>
	);
};
