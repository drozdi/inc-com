export interface ApiAccountParticipant {
	id: number;
	login: string;
}

export interface ApiAccount {
	id: number;
	name: string;
	description?: string | null;
	currency?: string;
	type?: string;
	order?: number;
	color?: string;
	icon?: string;
	number?: string | null;
	balance?: string | number;
	masterId?: number;
	isMaster?: boolean;
	createdAt?: string;
	updatedAt?: string;
	participants?: ApiAccountParticipant[];
}
