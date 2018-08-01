import { Component, Input, Output, EventEmitter } from "@angular/core";
import { BackgroundColorsMap, BorderColorsMap, TextColorsMap } from "../components/formatting";
import { findFieldDef } from "../components/fields";
import { Transform } from "../components/map-field-name.pipe";
import OpModes from "../components/op-modes";
import JobModes from "../components/job-modes";
import Actions from "../components/actions";

@Component({
	selector: "ichen-terminal-value-map",
	template: `
		<div class="input-group input-group-sm">
			<div class="input-group-prepend"><div class="input-group-text">
				<span>{{transform(info.field)}}</span>
				<span *ngIf="isNotNegated">=</span>
				<span *ngIf="isNegated"><></span>
			</div></div>
			<div class="form-control" [ngSwitch]="infoValue">
				<span *ngSwitchCase="null"><em>{{i18n.labelNothing}}</em></span>
				<span *ngSwitchCase="''"><em>{{i18n.labelBlank}}</em></span>
				<span *ngSwitchDefault>{{formatFieldValue(infoValue)}}</span>
			</div>
			<div class="input-group-append">
				<div class="input-group-text sample-text ichen-terminal-color {{defaultClasses}} {{info?.class }}"><span *ngIf="textColors">{{i18n.labelTextSample}}</span></div>
				<button type="button" (click)="editEvent.emit()" class="ichen-edit btn btn-sm btn-outline-secondary"><span class="glyphicon glyphicon-pencil"></span></button>
			</div>
		</div>
	`
})
export class TerminalValueMapComponent
{
	@Input() public readonly i18n!: ITranslationDictionary;

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
