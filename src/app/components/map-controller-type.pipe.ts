import { Pipe, PipeTransform } from "@angular/core";
import ControllerTypes from "./controllers";

@Pipe({ name: "mapControllerType" })
export class MapControllerTypePipe implements PipeTransform
{
	public transform(value: number)
	{
		for (const type of ControllerTypes) {
			if (type.id === value) return type.description;
		}
		return value;
	}
}

let instance: MapControllerTypePipe;

export function Transform(value: number)
{
	if (!instance) instance = new MapControllerTypePipe();
	return instance.transform(value);
}
