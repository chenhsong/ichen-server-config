export type Filters = "None" | "Status" | "Cycle" | "Mold" | "Actions" | "Alarms" | "Audit" | "JobCards" | "Operators" | "All";
export type ControllerTypes = "Ai01" | "Ai02" | "Ai11" | "Ai12" | "CPC60" | "MPC60" | "MPC7" | "CDC2000" | "CDC3000" | "CDC2000WIN" | "Generic" | "NewAge" | "CBmold300" | "CBmold800" | "Inovance" | "Unknown";

export interface Dictionary<T> { [key: string]: T; }
export interface DictionaryWithDefault<T extends object> extends Dictionary<T> { default: T; }

export type ITranslationDictionary = { [key: string]: string; }

export interface IWrapper
{
	id: number;
	isSaving?: boolean;
	isError?: boolean;
}

export type Wrapped<T extends object> = T & IWrapper;

export interface IUser
{
	id: number;
	password: string;
	name: string;
	isEnabled: boolean;
	accessLevel: number;
	filters: string;
}

export interface ILoggedInUser extends IUser
{
	roles: string[];
}

export type IUsers = Dictionary<IUser>;

export interface IFilters
{
	All: boolean;
	Status: boolean;
	Cycle: boolean;
	Mold: boolean;
	Actions: boolean;
	Alarms: boolean;
	Audit: boolean;
	JobCards: boolean;
	Operators: boolean;
	OPCUA: boolean;
}

export interface IController
{
	id: number;
	isEnabled: boolean;
	name: string;
	type: number;
	version: string;
	model: string;
	IP: string;
}

export type IControllers = Dictionary<IController>;