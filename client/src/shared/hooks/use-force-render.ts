import { useState } from 'react'

export function useForceRender() {
	const [, set] = useState(0)
	return () => set(i => i + 1)
}
