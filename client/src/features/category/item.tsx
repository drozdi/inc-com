import { useStoreUserProfile } from '@/entites/auth';
import { useStoreCategories } from '@/entites/inc-com';
import { ActionIcon, Group, Text, TextInput, Tooltip } from '@mantine/core';
import { useState } from 'react';
import { TbFileDots, TbFileLike, TbX } from 'react-icons/tb';

export function CategotyItem({ category }: { category: ICategory }) {
	const storeCategories = useStoreCategories();
	const { userData } = useStoreUserProfile();
	const [isEdit, setEdit] = useState(false);
	const isAction = category.owner_id === userData?.id;
	const [label, setLabel] = useState<string>(category.label);
	const [mcc, setMcc] = useState<string>(String(category.mcc));

	const handlerSave = () => {
		const data: Partial<ICategory> = {
			label,
		};
		if (mcc) {
			data.mcc = Number(mcc);
		}
		storeCategories.update(category.id, data);
		setEdit(false);
	};
	const handlerKeyPress = ({ key }: React.KeyboardEvent) => {
		if (key === 'Enter') {
			handlerSave();
		}
	};
	const handlerRemove = (category: ICategory) => {
		storeCategories.delete(category.id);
	};

	return (
		<Group>
			{isEdit && isAction ? (
				<>
					<TextInput
						flex="1"
						defaultValue={label}
						onChange={({ target }) => setLabel(target.value)}
						onKeyDown={handlerKeyPress}
						rightSectionWidth={150}
						rightSection={
							<TextInput
								placeholder="MCC Code"
								defaultValue={mcc}
								onChange={({ target }) => setMcc(target.value)}
								onKeyDown={handlerKeyPress}
							/>
						}
					/>
					<ActionIcon
						loading={storeCategories.isLoading}
						color="green"
						onClick={handlerSave}
					>
						<TbFileLike />
					</ActionIcon>
				</>
			) : (
				<Text flex="1">
					{label}
					{mcc ? ` (MCC ${mcc})` : ''}
				</Text>
			)}
			{isAction && !isEdit && (
				<Group>
					<Tooltip label="Переиминовать">
						<ActionIcon
							loading={storeCategories.isLoading}
							color="yellow"
							onClick={() => setEdit(true)}
						>
							<TbFileDots />
						</ActionIcon>
					</Tooltip>
					<Tooltip label="Удалить">
						<ActionIcon
							loading={storeCategories.isLoading}
							color="red"
							onClick={() => handlerRemove(category)}
						>
							<TbX />
						</ActionIcon>
					</Tooltip>
				</Group>
			)}
		</Group>
	);
}
