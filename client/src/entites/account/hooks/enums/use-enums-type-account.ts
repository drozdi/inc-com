import { type ComboboxItem } from '@mantine/core';

const data: Record<string, string> = {
	cash: 'Наличные',
	account: 'Счет',
	bank_account: 'Банковский счет',
	debit_card: 'Дебетовая карта',
	credit_card: 'Кредитная карта',
	investment: 'Вклад',
};
function findLabelByCode(type: string): string {
	return data[type] || type;
}
const dataSelect: ComboboxItem[] = [
	{
		label: 'Выберите тип',
		value: '',
		disabled: true,
	},
	...Object.entries(data).map(([value, label]) => ({
		value,
		label,
	})),
];

export function useEnumsTypeAccount() {
	return { isLoading: false, data, findLabelByCode, dataSelect };
}
