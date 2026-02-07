import { useStoreCategories } from '@/entites/inc-com';
import { notification } from '@/shared/notification';
import { ActionIcon, TextInput, type TextInputProps } from '@mantine/core';
import { useState } from 'react';
import { TbPlus } from 'react-icons/tb';
export function CategotyAdd({
	account_id,
	type,
	...props
}: TextInputProps & {
	account_id: ICategory['account_id'];
	type: string;
}) {
	const storeCategories = useStoreCategories();
	const [newLabel, setNewLabel] = useState('');

	const handlerSave = async () => {
		const label = newLabel.trim();
		if (!label) {
			notification.error('Ошибка', 'Введите название!');
			return;
		}
		storeCategories
			.add({
				account_id,
				type,
				label,
			})
			.then((data) => {
				setNewLabel('');
			});
	};
	const handlerKeyPress = ({ key }: React.KeyboardEvent) => {
		if (key === 'Enter') {
			handlerSave();
		}
	};
	return (
		<TextInput
			{...props}
			value={newLabel}
			onChange={({ target }) => setNewLabel(target.value)}
			rightSection={
				<ActionIcon onClick={handlerSave}>
					<TbPlus />
				</ActionIcon>
			}
			onKeyDown={handlerKeyPress}
		/>
	);
}
