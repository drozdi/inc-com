export const currencyFormat = (amount: number | string = 0) => {
	return amount.toLocaleString('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}
