import { Pipe, PipeTransform } from "@angular/core";
import { findFieldDef, IFieldDef } from "./fields";

@Pipe({ name: "isNumeric" })
export class IsNumericPipe implements PipeTransform
{
	public transform(field: IFieldDef[]): IFieldDef[]
	{
		return field.filter(fd => fd.type === "number");
	}
}
