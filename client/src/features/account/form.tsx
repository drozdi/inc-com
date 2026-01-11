import { Button, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	defaultAccount,
	useEnumsTypeAccount,
	useStoreAccounts,
} from '../../entites/account';
import { Template } from '../../layout';

interface AccountFormProps {
	id?: IAccount['id'];
}

export function AccountForm({ id }: AccountFormProps) {
	const sa = useStoreAccounts();
	const navigate = useNavigate();
	const form = useForm<IAccount>({
		mode: 'uncontrolled',
		initialValues: { ...defaultAccount },
		validate: {
			label: isNotEmpty('Заполните название'),
			type: isNotEmpty('Выберите тип счета'),
		},
		enhanceGetInputProps: ({ field, form, inputProps, options }) => {
			if (field === 'balance' && form.values.id) {
				return { readOnly: true };
			}
		},
	});
	const { dataSelect: types } = useEnumsTypeAccount();

	async function handleSave({ id, ...data }: IAccount) {
		if (id) {
			await sa.update(id, data);
		} else {
			await sa.add(data);
		}
	}
	useEffect(() => {
		if (!id) {
			return;
		}
		sa.detail(id).then((data) => {
			form.initialize(data as IAccount);
		});
	}, [id]);

	return (
		<Stack>
			<TextInput
				label="Название счета"
				placeholder="Название счета"
				required
				{...form.getInputProps('label')}
			/>
			<Select
				label="Тип"
				key={form.key('type')}
				required
				data={types}
				{...form.getInputProps('type')}
			/>
			<NumberInput
				label="Баланс"
				placeholder="Баланс"
				step={0.01}
				required
				{...form.getInputProps('balance')}
			/>
			<Template.Footer>
				<Group>
					<Button
						loading={sa.isLoading}
						onClick={() => {
							form.onSubmit(handleSave)();
							navigate(-1);
						}}
						color="green"
					>
						Сохранить
					</Button>
					<Button
						loading={sa.isLoading}
						onClick={() => {
							form.onSubmit(handleSave)();
						}}
						color="blue"
					>
						Применить
					</Button>
				</Group>
			</Template.Footer>
		</Stack>
	);
}
