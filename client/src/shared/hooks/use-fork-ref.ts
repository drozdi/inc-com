import { useMemo } from 'react'

/**
 * Функция setRef устанавливает значение для ссылки.
 * @param {Function|Object} ref - Ссылка, для которой нужно установить значение.
 * @param {*} [value=null] - Значение, которое нужно установить для ссылки.
 */
export function setRef(ref: Function | object, value: any = null) {
	if (typeof ref === 'function') {
		ref(value)
	} else if (ref && typeof ref === 'object' && 'current' in ref) {
		ref.current = value
	}
}

/**
 * Функция useForkRef создает функцию для установки значения для нескольких ссылок.
 * @param {...(Function|Object)} refs - Ссылки, для которых нужно установить значение.
 * @returns {Function|null} - Функция для установки значения для ссылок или null, если все ссылки равны null.
 */
export function useForkRef(...refs: any[]): Function | undefined {
	return useMemo<Function | undefined>((): Function | undefined => {
		if (refs.every(ref => ref == null)) {
			return undefined
		}
		return (instance: any) => {
			refs.forEach(ref => {
				setRef(ref, instance)
			})
		}
	}, refs)
}
