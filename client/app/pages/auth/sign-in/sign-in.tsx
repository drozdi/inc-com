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
import { isEmail, useForm } from '@mantine/form';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../stores';
import type { Route } from '../routes/+types/home';
import classes from './sign-in.module.css';

export function meta({}: Route.MetaArgs) {
	return [{ title: 'Вход' }];
}

export default () => {
	const { user } = useAuthStore();
	const navigate = useNavigate();
	if (user) {
		navigate('/');
	}
	const form = useForm({
		mode: 'uncontrolled',
		initialValues: { email: '', password: '' },
		validate: {
			email: isEmail('Invalid email'),
			password: (value) =>
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/.test(value)
					? 'Неверно заполнен пароль. Допускаются буквы, цифры и знаки "#?!@$%^&*-"'
					: null,
		},
	});

	return (
		<Container size={420} my={40}>
			<Title ta="center" className={classes.title}>
				Вход{' '}
			</Title>

			<Text className={classes.subtitle}>
				Если нет пользователя то <Anchor>Создайте его!</Anchor>
			</Text>

			<Paper withBorder shadow="sm" p={22} mt={30} radius="md">
				<TextInput
					label="Email"
					placeholder="you@mantine.dev"
					required
					radius="md"
					key={form.key('email')}
					{...form.getInputProps('email')}
				/>
				<PasswordInput
					label="Password"
					placeholder="Your password"
					required
					mt="md"
					radius="md"
					key={form.key('password')}
					{...form.getInputProps('password')}
				/>
				<Group justify="space-between" mt="lg">
					<Checkbox label="Remember me" />
					<Anchor component="button" size="sm">
						Forgot password?
					</Anchor>
				</Group>
				<Button fullWidth mt="xl" radius="md">
					Войти
				</Button>
			</Paper>
		</Container>
	);
};
