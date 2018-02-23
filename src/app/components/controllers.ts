export interface IControllerDescription
{
	name: ControllerTypes;
	description: string;
	obsolete?: boolean;
}

export default [
	{ name: "Ai01", description: "Ai-01", obsolete: true },
	{ name: "Ai02", description: "Ai-02" },
	{ name: "Ai11", description: "Ai-11", obsolete: true },
	{ name: "Ai12", description: "Ai-12" },
	{ name: "CPC60", description: "CPC-6.0" },
	{ name: "MPC60", description: "MPC-6.0" },
	{ name: "CDC2000", description: "CDC2000", obsolete: true },
	{ name: "CDC3000", description: "CDC3000", obsolete: true },
	{ name: "CDC2000WIN", description: "CDC2000WIN" },
	{ name: "SPS3300", description: "SPS3300", obsolete: true },
	{ name: "NewAge", description: "New-Age", obsolete: true },
	{ name: "CBmold300", description: "CBmold-300" },
	{ name: "CBmold800", description: "CBmold-800" }
] as IControllerDescription[];
