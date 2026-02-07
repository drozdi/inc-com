interface IUser {
	id: number;
	email: string;
	alias: string;
	second_name: string;
	first_name: string;
	patronymic: string;
	description: string;
	date_register: string;
	last_login: string;
	x_timestamp: string;
}

interface IStoreAuth extends IStore {
	isAuthenticated: boolean;
	isAuth: boolean;
	load(): Promise<void>;
	clearAuth(): void;
	login(username: string, password: string): Promise<boolean>;
	logout(): Promise<void>;
}

interface IStoreUserProfile extends IStore {
	userData?: IUser;
	product_id?: string | number;
	setUserData(data: Partial<IUser>): void;
	load(reloading?: boolean): Promise<IUser | undefined>;
	update(userData: IUser): Promise<IUser | undefined>;
	updatePassword(oldPassword: string, newPassword: string): Promise<boolean>;
	delete(): Promise<any>;
	reset(): void;
}
