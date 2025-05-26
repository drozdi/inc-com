// components/AccountForm.tsx
import { Button, MultiSelect, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAccountStore } from '../stores/accountStore';

interface AccountFormProps {
	initialValues?: Partial<Account>;
	onSuccess: () => void;
}

export const AccountForm = ({ initialValues, onSuccess }: AccountFormProps) => {
	const { createAccount, updateAccount } = useAccountStore();
	const form = useForm({
		initialValues: {
			name: '',
			type: 'personal',
			users: [],
			...initialValues,
		},
	});

	const handleSubmit = (values: typeof form.values) => {
		if (initialValues?.id) {
			updateAccount(initialValues.id, values);
		} else {
			createAccount(values);
		}
		onSuccess();
	};

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<TextInput label="Account Name" {...form.getInputProps('name')} />
			<Select
				label="Account Type"
				data={[
					{ value: 'personal', label: 'Personal' },
					{ value: 'shared', label: 'Shared' },
				]}
				{...form.getInputProps('type')}
			/>
			{form.values.type === 'shared' && (
				<MultiSelect
					label="Invite Users"
					placeholder="Enter emails"
					data={[]} // Здесь можно добавить поиск пользователей
					{...form.getInputProps('users')}
				/>
			)}
			<Button type="submit">Save</Button>
		</form>
	);
};
