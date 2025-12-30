import { ActionIcon } from '@mantine/core';
import { TbCircleX } from 'react-icons/tb';

export function ButtonRemove({ children = <TbCircleX />, ...props }) {
	return (
		<ActionIcon color="red" {...props}>
			{children}
		</ActionIcon>
	);
}
