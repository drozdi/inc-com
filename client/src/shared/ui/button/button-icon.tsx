import { ActionIcon } from '@mantine/core'
import { Icon } from '../icon/icon'

export function ButtonIcon({ children, ...props }) {
	return (
		<ActionIcon {...props}>
			<Icon>{children}</Icon>
		</ActionIcon>
	)
}
