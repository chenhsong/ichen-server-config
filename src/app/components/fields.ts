export interface IFieldDef
{
	name: string;
	description: string;
	type: string;
	filter?: string;
}

export const DefaultField: IFieldDef = { name: "unset", description: "labelUseDefault", type: "null" };
export const NullField: IFieldDef = { name: "null", description: "labelNothing", type: "null" };
export const AlarmsField: IFieldDef = { name: "alarms?.", description: "labelFieldAlarms", type: "boolean" };

export function findFieldDef(name: string | null)
{
	if (!name) return null;

	for (const field of StandardFields) {
		if (field.name === name) return field;
	}
	for (const field of CycleDataFields) {
		if (field.name === name) return field;
	}
	if (/^alarms\?\./.test(name)) return AlarmsField;
	return null;
}

export function fieldNeedsSpecify(name: string | null)
{
	if (!name) return false;
	if (/^alarms\?\./.test(name)) return true;
	return false;
}

export const StandardFields: IFieldDef[] = [
	{ name: "controllerId", description: "labelFieldMachineNo", type: "ID" },
	{ name: "displayName", description: "labelFieldMachineName", type: "string" },
	{ name: "model", description: "labelFieldMachineModel", type: "string" },
	{ name: "controllerType", description: "labelFieldControllerType", filter: "textMap:'ControllerTypes'", type: "ControllerTypes" },
	{ name: "version", description: "labelFieldProtocolVersion", type: "string" },
	{ name: "IP", description: "labelFieldIPAddress", type: "string" },
	{ name: "opMode", description: "labelFieldOpMode", filter: "textMap:'OpModes'", type: "OpModes" },
	{ name: "jobMode", description: "labelFieldJobMode", filter: "textMap:'JobModes'", type: "JobModes" },
	{ name: "jobCardId", description: "labelFieldJobCard", type: "string" },
	{ name: "lastConnectionTime", description: "labelFieldConnectTime", filter: "date:'y-M-d H:mm:ss'", type: "Date" },
	{ name: "operatorId", description: "labelFieldOperator", type: "ID" },
	{ name: "operatorName", description: "labelFieldOperatorName", type: "string" },
	{ name: "moldId", description: "labelFieldMold", type: "string" },
	{ name: "actionId", description: "labelFieldAction", filter: "textMap:'Actions'", type: "Actions" },
	{ name: "alarm?.key", description: "labelFieldLastAlarmName", type: "string" },
	{ name: "alarm?.value", description: "labelFieldLastAlarmState", type: "boolean" },
	{ name: "alarm?.timestamp", description: "labelFieldLastAlarmTime", filter: "date:'d/M HH:mm'", type: "Date" },
	{ name: "activeAlarms", description: "labelFieldActiveAlarms", filter: "flatten:'key'", type: "string" }
];

export const CycleDataFields: IFieldDef[] = [
	{ name: "lastCycleData?.Z_QDGODCNT", description: "labelCycleProductionQuantity", type: "number" },
	{ name: "lastCycleData?.Z_QDCYCTIM", description: "labelCycleCycleTime", type: "number", filter: "number:'1.0-1'" },
	{ name: "lastCycleData?.Z_QDINJTIM", description: "labelCycleInjectionTime", type: "number", filter: "number:'1.0-1'" },
	{ name: "lastCycleData?.Z_QDPLSTIM", description: "labelCyclePlasticizingTime", type: "number" },
	{ name: "lastCycleData?.Z_QDINJENDPOS", description: "labelCycleInjectionEndPosition", type: "number", filter: "number:'1.0-1'" },
	{ name: "lastCycleData?.Z_QDPLSENDPOS", description: "labelCyclePlasticizingEndPosition", type: "number", filter: "number:'1.0-1'" },
	{ name: "lastCycleData?.Z_QDFLAG", description: "labelCycleQualityCheckFlag", type: "number" },
	{ name: "lastCycleData?.Z_QDPRDCNT", description: "labelCycleMaxProductionQuantity", type: "number" },
	{ name: "lastCycleData?.Z_QDCOLTIM", description: "labelCycleCoolingTime", type: "number", filter: "number:'1.0-1'" },
	{ name: "lastCycleData?.Z_QDMLDOPNTIM", description: "labelCycleMoldOpenTime", type: "number", filter: "number:'1.0-1'" },
	{ name: "lastCycleData?.Z_QDMLDCLSTIM", description: "labelCycleMoldCloseTime", type: "number", filter: "number:'1.0-1'" },
	{ name: "lastCycleData?.Z_QDVPPOS", description: "labelCycleVPPosition", type: "number", filter: "number:'1.0-1'" },
	{ name: "lastCycleData?.Z_QDMLDOPNENDPOS", description: "labelCycleMoldOpenEndPosition", type: "number", filter: "number:'1.0-1'" },
	{ name: "lastCycleData?.Z_QDMAXINJSPD", description: "labelCycleMaxInjectionSpeed", type: "number", filter: "number:'1.0-1'" },
	{ name: "lastCycleData?.Z_QDMAXPLSRPM", description: "labelCycleMaxPlasticizing", type: "number" },
	{ name: "lastCycleData?.Z_QDNOZTEMP", description: "labelCycleNozzleTemperature", type: "number" },
	{ name: "lastCycleData?.Z_QDTEMPZ01", description: "labelCycleBarrelTemperatureZone1", type: "number" },
	{ name: "lastCycleData?.Z_QDTEMPZ02", description: "labelCycleBarrelTemperatureZone2", type: "number" },
	{ name: "lastCycleData?.Z_QDTEMPZ03", description: "labelCycleBarrelTemperatureZone3", type: "number" },
	{ name: "lastCycleData?.Z_QDTEMPZ04", description: "labelCycleBarrelTemperatureZone4", type: "number" },
	{ name: "lastCycleData?.Z_QDTEMPZ05", description: "labelCycleBarrelTemperatureZone5", type: "number" },
	{ name: "lastCycleData?.Z_QDTEMPZ06", description: "labelCycleBarrelTemperatureZone6", type: "number" },
	{ name: "lastCycleData?.Z_QDBCKPRS", description: "labelCycleBackPressure", type: "number", filter: "number:'1.0-1'" },
	{ name: "lastCycleData?.Z_QDHLDTIM", description: "labelCycleHoldingTime", type: "number", filter: "number:'1.0-1'" },
	{ name: "lastCycleData?.Z_QDCPT01", description: "labelCycleHotRunnerZone1", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT02", description: "labelCycleHotRunnerZone2", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT03", description: "labelCycleHotRunnerZone3", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT04", description: "labelCycleHotRunnerZone4", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT05", description: "labelCycleHotRunnerZone5", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT06", description: "labelCycleHotRunnerZone6", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT07", description: "labelCycleHotRunnerZone7", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT08", description: "labelCycleHotRunnerZone8", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT09", description: "labelCycleHotRunnerZone9", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT10", description: "labelCycleHotRunnerZone10", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT11", description: "labelCycleHotRunnerZone11", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT12", description: "labelCycleHotRunnerZone12", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT13", description: "labelCycleHotRunnerZone13", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT14", description: "labelCycleHotRunnerZone14", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT15", description: "labelCycleHotRunnerZone15", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT16", description: "labelCycleHotRunnerZone16", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT17", description: "labelCycleHotRunnerZone17", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT18", description: "labelCycleHotRunnerZone18", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT19", description: "labelCycleHotRunnerZone19", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT20", description: "labelCycleHotRunnerZone20", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT21", description: "labelCycleHotRunnerZone21", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT22", description: "labelCycleHotRunnerZone22", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT23", description: "labelCycleHotRunnerZone23", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT24", description: "labelCycleHotRunnerZone24", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT25", description: "labelCycleHotRunnerZone25", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT26", description: "labelCycleHotRunnerZone26", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT27", description: "labelCycleHotRunnerZone27", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT28", description: "labelCycleHotRunnerZone28", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT29", description: "labelCycleHotRunnerZone29", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT30", description: "labelCycleHotRunnerZone30", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT31", description: "labelCycleHotRunnerZone31", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT32", description: "labelCycleHotRunnerZone32", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT33", description: "labelCycleHotRunnerZone33", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT34", description: "labelCycleHotRunnerZone34", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT35", description: "labelCycleHotRunnerZone35", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT36", description: "labelCycleHotRunnerZone36", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT37", description: "labelCycleHotRunnerZone37", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT38", description: "labelCycleHotRunnerZone38", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT39", description: "labelCycleHotRunnerZone39", type: "number" },
	{ name: "lastCycleData?.Z_QDCPT40", description: "labelCycleHotRunnerZone40", type: "number" }
];
