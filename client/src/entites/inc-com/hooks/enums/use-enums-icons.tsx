import { type ComboboxItem } from '@mantine/core';
import { TbCards } from 'react-icons/tb';

const data: Record<string, any> = {
	cards: TbCards,
};
const dataSelect: ComboboxItem[] = Object.entries(data).map(([value, icon]) => ({
	value,
	label: icon as string,
}));

const findByCode = (code: string) => {
	return data[code] || code;
};

export function useEnumsIcons() {
	return {
		isLoading: false,
		dataSelect,
		findByCode,
	};
}
