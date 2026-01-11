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
