import { useCallback, useEffect, useRef } from 'react'

type Timeout = ReturnType<typeof setTimeout>

/**
 * Функция useTimeout создает таймер и функцию для его очистки.
 * @param {Function} fn - Функция, которая будет вызвана по истечении таймера.
 * @param {number} [delay=0] - Задержка перед вызовом функции.
 * @param {boolean} [when=true] - Условие, при котором таймер должен быть запущен.
 * @returns {Array} - Массив, содержащий функцию для очистки таймера.
 */
export const useTimeout = (fn: Function, delay: number = 0, when: boolean = true) => {
	const timeout = useRef<Timeout | null>(null)
	const savedCallback = useRef<Function | null>(null)

	const clear = useCallback(() => clearTimeout(timeout.current as Timeout), [timeout.current])

	useEffect(() => {
		savedCallback.current = fn
	})

	useEffect(() => {
		function callback() {
			savedCallback.current?.()
		}

		if (when) {
			timeout.current = setTimeout(callback, delay)
			return clear
		} else {
			clear()
		}
	}, [delay, when])

	useEffect(() => clear, [])

	return clear
}
