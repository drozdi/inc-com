import { useStoreUserProfile } from "@/entites/auth";
import { Loading, PhoneInput } from "@/shared/ui";
import {
	Button,
	Divider,
	Group,
	PasswordInput,
	Stack,
	TextInput,
} from "@mantine/core";
import { isNotEmpty, matches, useForm } from "@mantine/form";
import { Template } from "@t";
import { yupResolver } from "mantine-form-yup-resolver";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const fieldsSchema = yup.object().shape({
	first_name: yup.string().required("Заполните имя"),
	last_name: yup.string().required("Заполните фамилию"),
	father_name: yup.string().required("Заполните отчество"),
	email: yup
		.string()
		.email("Введите корректный email")
		.required("Заполните email"),
	/*phone: yup
		.string()
		.matches(
			/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
			'Неверный номер телефона'
		)
		.required('Заполните телефон'),*/
});

export const PersonalForm = observer(() => {
	const storeUserProfile = useStoreUserProfile();
	const { isLoading, userData } = storeUserProfile;
	const navigate = useNavigate();
	const form = useForm({
		mode: "uncontrolled",
		name: "personalForm",
		initialValues: {
			first_name: userData?.first_name || "",
			last_name: userData?.last_name || "",
			father_name: userData?.father_name || "",
			email: userData?.email || "",
			phone: userData?.phone || "",
		},
		validate: yupResolver(fieldsSchema),
		onValuesChange: (values) => {
			storeUserProfile.setUserData(values);
		},
	});
	const formPassword = useForm({
		mode: "uncontrolled",
		name: "passwordFormPassword",
		initialValues: {
			oldPassword: "",
			newPassword: "",
			re_password: "",
		},
		validate: {
			oldPassword: isNotEmpty("Введите пароль"),
			newPassword: matches(
				/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/,
				"Допустимые символы: буквы, цифры и спец. символы @#$%^&*",
			),
			re_password: (value, values) =>
				value !== values.newPassword
					? "Пароли должны совпадать!"
					: null,
		},
	});

	async function handleSave(formData: IUser) {
		await storeUserProfile.update(formData);
	}
	async function handleSaveNavigate(formData: IUser) {
		await storeUserProfile.update(formData);
		navigate("/");
	}
	async function handleRemove() {
		if (!confirm("Вы уверены что хотите удалить себя?")) {
			return;
		}
	}
	async function handleChangePassword({
		oldPassword,
		newPassword,
	}: {
		oldPassword: string;
		newPassword: string;
	}) {
		const res = await storeUserProfile.updatePassword(
			oldPassword,
			newPassword,
		);
		if (res) {
			formPassword.setValues({
				oldPassword: "",
				newPassword: "",
				re_password: "",
			});
		}
	}

	const isValid = true;

	useEffect(() => {
		if (userData?.email) {
			form.initialize(userData);
		}
	}, [userData]);

	useEffect(() => {
		storeUserProfile.load();
	}, []);

	return (
		<Loading active={isLoading} keepMounted>
			<Stack component="form">
				<TextInput
					placeholder="Имя"
					size="md"
					type="text"
					variant="underline"
					{...form.getInputProps("first_name")}
				/>
				<TextInput
					placeholder="Фамилия"
					type="text"
					size="md"
					variant="underline"
					{...form.getInputProps("last_name")}
				/>
				<TextInput
					placeholder="Отчество"
					type="text"
					size="md"
					variant="underline"
					{...form.getInputProps("father_name")}
				/>
				<TextInput
					placeholder="Email"
					type="email"
					size="md"
					variant="underline"
					{...form.getInputProps("email")}
				/>
				<PhoneInput
					placeholder="Телефон"
					type="phone"
					required
					variant="underline"
					size="md"
					{...form.getInputProps("phone")}
				/>
				<Divider />
				<PasswordInput
					placeholder="Старый пароль"
					size="md"
					variant="underline"
					{...formPassword.getInputProps("oldPassword")}
				/>
				<PasswordInput
					placeholder="Новый пароль"
					size="md"
					variant="underline"
					{...formPassword.getInputProps("newPassword")}
				/>
				<PasswordInput
					placeholder="Повтори пароль"
					size="md"
					variant="underline"
					{...formPassword.getInputProps("re_password")}
				/>

				<Group justify="end">
					<Button
						onClick={formPassword.onSubmit(handleChangePassword)}
					>
						Обновить пароль
					</Button>
				</Group>
				<Template slot="footer">
					<Group>
						<Button
							color="green"
							onClick={form.onSubmit(handleSaveNavigate)}
							loading={isLoading}
							disabled={!isValid}
						>
							Сохранить
						</Button>
						<Button
							onClick={form.onSubmit(handleSave)}
							loading={isLoading}
							disabled={!isValid}
						>
							Применить
						</Button>
					</Group>
					<Button
						color="red"
						onClick={handleRemove}
						loading={isLoading}
						disabled={!isValid}
					>
						Удалить
					</Button>
				</Template>
			</Stack>
		</Loading>
	);
});
