interface IRequestList {
	limit: number;
	offset: number;
}

type IResponse<T> = T;

interface IResponseList<T> {
	items: T[];
	countItems: number;
	totalItems: number;
	limit: number;
	offset: number;
	next: number;
	prev: number;
	total: number;
}

interface IStore<T extends object> {
	isLoading: boolean;
	error: any;
	load: (reload?: boolean) => Promise<void>;
	list: T[];
	findById: (id: T['id']) => T | undefined;
	add: (data: Partial<T>) => Promise<T | undefined>;
	detail: (id: T['id']) => Promise<T | undefined>;
	update: (id: T['id'], data: Partial<T>) => Promise<T | undefined>;
	delete: (id: T['id']) => Promise<T | undefined>;
}
