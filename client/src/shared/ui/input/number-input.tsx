import { NumberInput as NumberComponent, type NumberInputProps } from '@mantine/core'
import { useMemo, useState } from 'react'

interface NumberComponentProps extends NumberInputProps {
	round?: number
}

export function NumberInput({
	value,
	defaultValue,
	step: stepProp = 1,
	round = 1,
	onChange,
	...props
}: NumberComponentProps) {
	const decimals = Math.max(0, Math.log10(round))
	const [displayValue, setDisplayValue] = useState<number>(defaultValue / round)
	const step = stepProp / round

	const formattedValue = useMemo(() => {
		return displayValue.toFixed(decimals)
	}, [displayValue, round, decimals])

	const handleChange = (val: string | number) => {
		setDisplayValue(val)
		onChange?.(val * round) // Конвертируем обратно в исходное значение
	}

	return <NumberComponent value={formattedValue} precision={decimals} step={step} onChange={handleChange} {...props} />
}
