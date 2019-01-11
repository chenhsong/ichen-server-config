import { Component, Input, Output, EventEmitter } from "@angular/core";
import { BackgroundColorsMap, BorderColorsMap, TextColorsMap } from "../components/formatting";
import { findFieldDef } from "../components/fields";
import { Transform } from "../components/map-field-name.pipe";
import OpModes from "../components/op-modes";
import JobModes from "../components/job-modes";
import Actions from "../components/actions";
import { Config } from "../app.config";

@Component({
	selector: "ichen-terminal-value-map",
	templateUrl: "../templates/terminal-value-map.component.html"
})
export class TerminalValueMapComponent
{
	@Input() public readonly info!: Terminal.IClassMap;
	@Input() public readonly defaultField: string | null = null;
	@Input() public readonly defaultClasses: string | null = null;
	@Input() public readonly textColors = true;
	@Input() public readonly backgroundColors = true;
	@Output("edit") public readonly editEvent = new EventEmitter();

	public readonly backgroundColorsMap = BackgroundColorsMap;
	public readonly textColorsMap = TextColorsMap;
	public readonly borderColorsMap = BorderColorsMap;

	public readonly transform = Transform;

	public get i18n() { return Config.i18n; }

	public get infoValue()
	{
		return this.isNegated ?
			(this.info as Terminal.IClassMapNegatedValueBase).notValue :
			(this.info as Terminal.IClassMapValueBase).value;
	}

	public get isNotNegated() { return this.info.hasOwnProperty("value"); }
	public get isNegated() { return this.info.hasOwnProperty("notValue"); }

	public formatFieldValue(value: unknown)
	{
		const field = findFieldDef(this.info.field || this.defaultField);

		if (field) {
			try {
				switch (field.type) {
					case "OpModes": return this.i18n[OpModes.filter(x => x.name === value)[0].description];
					case "JobModes": return this.i18n[JobModes.filter(x => x.name === value)[0].description];
					case "Actions": return Actions.filter(x => x.id === value)[0].description;
					case "Date": return (value as Date).toISOString();
					case "boolean": return this.i18n[!!value ? "labelTrue" : "labelFalse"];
					default: return (value === null) ? "" : (value as any).toString();
				}
			} catch (error) {
				return (value === null) ? "" : (value as any).toString();
			}
		} else {
			return (value === null) ? "" : (value as any).toString();
		}
	}
}
