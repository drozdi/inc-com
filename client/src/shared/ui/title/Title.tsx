import { Title as MantineTitle } from '@mantine/core'

export function Title({ children, ...props }: Record<string, any>) {
	if (children) {
		return <MantineTitle {...props}>{children}</MantineTitle>
	}
	return ''
}
