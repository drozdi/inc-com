import { Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuthStore } from '../stores/authStore';

export const AuthForm = ({ isLogin }: { isLogin: boolean }) => {
	const { login, register, loading } = useAuthStore();
	const form = useForm({
		initialValues: {
			email: '',
			password: '',
			name: '',
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		try {
			if (isLogin) {
				await login(values.email, values.password);
			} else {
				await register({ ...values });
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			{!isLogin && <TextInput label="Name" {...form.getInputProps('name')} />}
			<TextInput label="Email" type="email" {...form.getInputProps('email')} />
			<PasswordInput label="Password" {...form.getInputProps('password')} />
			<Button type="submit" loading={loading}>
				{isLogin ? 'Login' : 'Register'}
			</Button>
		</form>
	);
};
