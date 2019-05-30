export interface IControllerDescription
{
	id: number;
	name: ControllerTypes;
	description: string;
	obsolete?: boolean;
}

const list: IControllerDescription[] = [
	{ id: 1, name: "Ai01", description: "Ai-01", obsolete: true },
	{ id: 6, name: "Ai02", description: "Ai-02" },
	{ id: 2, name: "Ai11", description: "Ai-11", obsolete: true },
	{ id: 7, name: "Ai12", description: "Ai-12" },
	{ id: 8, name: "CPC60", description: "CPC-6.0" },
	{ id: 9, name: "MPC60", description: "MPC-6.0" },
	{ id: 12, name: "MPC7", description: "MPC-7.0" },
	{ id: 98, name: "CDC2000", description: "CDC2000", obsolete: true },
	{ id: 4, name: "CDC3000", description: "CDC3000", obsolete: true },
	{ id: 3, name: "CDC2000WIN", description: "CDC2000WIN" },
	{ id: 0, name: "Generic", description: "Generic", obsolete: true },
	{ id: 5, name: "NewAge", description: "New-Age", obsolete: true },
	{ id: 10, name: "CBmold300", description: "CBmold-300" },
	{ id: 11, name: "CBmold800", description: "CBmold-800" },
	{ id: 300124, name: "Inovance", description: "Inovance" }
];

export default list;
