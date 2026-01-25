import { MantineProvider } from '@mantine/core'
import { act, type RenderOptions, type RenderResult, render as testingLibraryReact } from '@testing-library/react'
import { theme } from '../src/app/app-provider'

export function render(ui: React.ReactNode, options?: Omit<RenderOptions, 'queries'> | undefined) {
	return testingLibraryReact(<>{ui}</>, {
		...options,
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<MantineProvider theme={theme} env='test'>
				{children}
			</MantineProvider>
		),
	})
}

export async function renderWithAct(ui: React.ReactNode) {
	let result: RenderResult | null = null
	await act(async () => {
		result = render(ui)
	})
	return result!
}
