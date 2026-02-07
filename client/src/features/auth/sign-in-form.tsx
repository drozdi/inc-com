import { useStoreAuth } from '@/entites/auth';
import { Loading } from '@/shared/ui';
import { Box, Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

export const SignInForm = (props) => {
	const storeAuth = useStoreAuth();
	const form = useForm({
		mode: 'uncontrolled',
		onSubmitPreventDefault: 'always',
		name: 'signUp',
		initialValues: {
			username: '',
			password: '',
		},
	});
	const { isLoading } = storeAuth;
	const navigate = useNavigate();
	const handleSubmit = async ({ username, password }) => {
		const res = await storeAuth.login(username, password);
		if (true === res) {
			navigate('/', { replace: true });
		}
	};

	return (
		<Box {...props}>
			<Stack<form>
				component="form"
				name="signIn"
				onSubmit={(event) => {
					event.preventDefault();
					form.onSubmit(handleSubmit)();
				}}
			>
				<Loading active={isLoading} keepMounted>
					<TextInput
						label="Login"
						placeholder="Login"
						type="text"
						autoComplete="login"
						required
						{...form.getInputProps('username')}
					/>
					<PasswordInput
						label="Пароль"
						placeholder="Пароль"
						type="password"
						autoComplete="current-password"
						required
						{...form.getInputProps('password')}
					/>
				</Loading>
				<Button type="submit" fullWidth loading={isLoading}>
					Войти
				</Button>
			</Stack>
		</Box>
	);
};
