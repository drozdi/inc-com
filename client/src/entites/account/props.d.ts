interface IAccount {
	id: number;
	x_timestamp: string;
	owner_id: number;
	sort: number;
	label: string;
	balance: number;
	type: string;
}

interface ICategory {
	id: number;
	x_timestamp: string;
	owner_id: number;
	account_id: number;
	sort: number;
	label: string;
	type: string;
}

interface IStoreAccount {
	isLoading: boolean;
	error?: IError;
	list: IAccount[];
	fetch: (reload?: boolean) => Promise<void>;
	findById: (id: IAccount['id']) => IAccount | undefined;
	add: (data: Partial<IAccount>) => Promise<IAccount | undefined>;
	detail: (id: IAccount['id']) => Promise<IAccount | undefined>;
	update: (
		id: IAccount['id'],
		data: Partial<IAccount>,
	) => Promise<IAccount | undefined>;
	delete: (id: IAccount['id']) => Promise<IAccount | undefined>;
}

interface IStoreCategory {
	isLoading: boolean;
	error?: IError;
	list: ICategory[];
	fetch: (reload?: boolean) => Promise<void>;
	/*findById: (id: IAccount['id']) => IAccount | undefined;
	add: (data: Partial<IAccount>) => Promise<IAccount | undefined>;
	detail: (id: IAccount['id']) => Promise<IAccount | undefined>;
	update: (
		id: IAccount['id'],
		data: Partial<IAccount>,
	) => Promise<IAccount | undefined>;
	delete: (id: IAccount['id']) => Promise<IAccount | undefined>;*/
}
