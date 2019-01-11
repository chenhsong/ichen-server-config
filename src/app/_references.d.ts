declare module "*.json" {
	const value: any;
	export default value;
}

type Filters = "None" | "Status" | "Cycle" | "Mold" | "Actions" | "Alarms" | "Audit" | "JobCards" | "Operators" | "All";
type ControllerTypes = "Ai01" | "Ai02" | "Ai11" | "Ai12" | "CPC60" | "MPC60" | "CDC2000" | "CDC3000" | "CDC2000WIN" | "SPS3300" | "NewAge" | "CBmold300" | "CBmold800" | "Unknown";

interface Dictionary<T> { [key: string]: T; }
interface DictionaryWithDefault<T extends object> extends Dictionary<T> { default: T; }

type ITranslationDictionary = { [key: string]: string; }

interface IWrapper
{
	id: number;
	isSaving?: boolean;
	isError?: boolean;
}

type Wrapped<T extends object> = T & IWrapper;

interface IUser
{
	id: number;
	password: string;
	name: string;
	isEnabled: boolean;
	accessLevel: number;
	filters: string;
}

interface ILoggedInUser extends IUser
{
	roles: string[];
}

type IUsers = Dictionary<IUser>;

interface IFilters
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

interface IController
{
	id: number;
	isEnabled: boolean;
	name: string;
	type: ControllerTypes;
	version: string;
	model: string;
	IP: string;
}

type IControllers = Dictionary<IController>;