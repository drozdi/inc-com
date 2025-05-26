import {
	Anchor,
	Button,
	Checkbox,
	Container,
	Group,
	Paper,
	PasswordInput,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import type { Route } from '../routes/+types/home';
import classes from './sign-up.module.css';

export function meta({}: Route.MetaArgs) {
	return [{ title: 'Вход' }];
}

export default () => {
	return (
		<Container size={420} my={40}>
			<Title ta="center" className={classes.title}>
				Вход{' '}
			</Title>

			<Text className={classes.subtitle}>
				Если нет акаунта <Anchor>Создать</Anchor>
			</Text>

			<Paper withBorder shadow="sm" p={22} mt={30} radius="md">
				<TextInput
					label="Email"
					placeholder="you@mantine.dev"
					required
					radius="md"
				/>
				<PasswordInput
					label="Password"
					placeholder="Your password"
					required
					mt="md"
					radius="md"
				/>
				<Group justify="space-between" mt="lg">
					<Checkbox label="Запомнить меня" />
					<Anchor component="button" size="sm">
						Запомнить
					</Anchor>
				</Group>
				<Button fullWidth mt="xl" radius="md">
					Регистрация
				</Button>
			</Paper>
		</Container>
	);
};
