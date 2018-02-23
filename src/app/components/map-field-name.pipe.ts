import { Pipe, PipeTransform } from "@angular/core";
import { StandardFields, CycleDataFields } from "./fields";
import { Config } from "../app.config";

@Pipe({ name: "mapFieldName" })
export class MapFieldNamePipe implements PipeTransform
{
	public transform(value: string | undefined | null)
	{
		if (value === null || value === undefined) return "";
		if (value.trim().length === 0) return "";

		for (const field of StandardFields) {
			if (field.name === value) return Config.i18n[field.description] || field.description;
		}
		for (const field of CycleDataFields) {
			if (field.name === value) return Config.i18n[field.description] || field.description;
		}
		if (/^alarms\?\./.test(value)) return `${Config.i18n.labelFieldAlarmPrefix} ${value.substr(8)}`;
		return value;
	}
}

let instance: MapFieldNamePipe;

export function Transform(value: string | undefined | null)
{
	if (!instance) instance = new MapFieldNamePipe();
	return instance.transform(value);
}
