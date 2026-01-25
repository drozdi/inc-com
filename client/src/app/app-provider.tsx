import { ProviderMantine } from './providers/mantine'
import { ProviderQueryClient } from './providers/query-client'
import { ProviderRouter } from './providers/router'

export function AppProvider({ children }: { children: React.ReactNode }) {
	return (
		<ProviderMantine>
			<ProviderQueryClient>
				<ProviderRouter>{children}</ProviderRouter>
			</ProviderQueryClient>
		</ProviderMantine>
	)
}
