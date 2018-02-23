import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { fieldNeedsSpecify, findFieldDef, StandardFields, CycleDataFields, DefaultField, NullField, AlarmsField } from "../components/fields";

const CustomValue = "__CUSTOM__";

@Component({
	selector: "ichen-terminal-add-field",
	template: `
		<div class="card">
			<div class="card-header badge-success">
				<span (click)="closeEvent.emit()" class="ichen-close close float-right">&times;</span>
				{{title}}
			</div>
			<div class="card-body">
				<div class="input-group input-group-sm">
					<span class="input-group-addon">{{i18n.labelField}}</span>

					<select (change)="field=$event.target.value" class="form-control custom-select p-y-0 p-l-0">
						<option *ngIf="useDefault" value="unset">{{i18n.labelUseDefault}}</option>
						<optgroup label="{{i18n.labelStandardFields}}">
							<option *ngFor="let opt of StandardFields" value="{{opt.name}}">{{i18n[opt.description]}}</option>
						</optgroup>
						<optgroup label="{{i18n.labelCycleDataFields}}">
							<option *ngFor="let opt of CycleDataFields" value="{{opt.name}}">{{i18n[opt.description]}}</option>
						</optgroup>
						<option *ngIf="true" value="alarms?.">{{i18n.labelFieldAlarms}}</option>
					</select>
				</div>

				<div *ngIf="useMinMax && isNumericField">
					<div class="input-group input-group-sm">
						<span class="input-group-addon">{{i18n.labelMin}}</span>
						<select #minMode (change)="min=$event.target.value" class="form-control custom-select p-y-0 p-l-0">
							<option value="null">{{i18n.labelNothing}}</option>
							<option value="__CUSTOM__">{{i18n.labelCustomValue}}</option>
							<option value="_0">0</option>
							<option value="_1">1</option>
							<option value="_100">100</option>
							<option *ngFor="let opt of CycleDataFields|isNumeric" value="{{opt.name}}">{{i18n[opt.description]}}</option>
						</select>
						<input *ngIf="minMode.value=='__CUSTOM__'" (change)="$event.target.value=minValue=parseFloat($event.target.value)" class="form-control" />
					</div>
					<div class="input-group input-group-sm">
						<span class="input-group-addon">{{i18n.labelMax}}</span>
						<select #maxMode (change)="max=$event.target.value" class="form-control custom-select p-y-0 p-l-0">
							<option value="null">{{i18n.labelNothing}}</option>
							<option value="__CUSTOM__">{{i18n.labelCustomValue}}</option>
							<option value="_0">0</option>
							<option value="_1">1</option>
							<option value="_100">100</option>
							<option *ngFor="let opt of CycleDataFields|isNumeric" value="{{opt.name}}">{{i18n[opt.description]}}</option>
						</select>
						<input *ngIf="maxMode.value=='__CUSTOM__'" (change)="$event.target.value=maxValue=parseFloat($event.target.value)" class="form-control" />
					</div>
				</div>

				<div *ngIf="fieldNeedsSpecify" class="input-group input-group-sm has-feedback" [class.has-error]="!validAlarmName">
					<span class="input-group-addon negation">{{i18n.labelFieldAlarmName}}</span>
					<input (input)="alarmName=$event.target.value" (change)="alarmName=$event.target.value" class="form-control" />
					<span *ngIf="!validAlarmName" class="glyphicon glyphicon-warning-sign form-control-feedback"></span>
				</div>
			</div>

			<div class="card-footer buttons-strip">
				<button type="button" [disabled]="fieldNeedsSpecify && !validAlarmName" (click)="doAdd()" class="btn btn-sm btn-success first"><span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;{{i18n.btnAdd}}</button>
				<button type="button" (click)="closeEvent.emit()" class="btn btn-sm btn-secondary last"><span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;{{i18n.btnCancel}}</button>
				<div class="clearfix"></div>
			</div>
		</div>
	`
})
export class TerminalAddFieldComponent implements OnInit
{
	@Input() public readonly i18n!: ITranslationDictionary;

	@Input() public readonly title!: string;
	@Input() public readonly useDefault = false;
	@Input() public readonly useMinMax = false;
	@Output("close") public readonly closeEvent = new EventEmitter<void>();
	@Output("add") public readonly addEvent = new EventEmitter<{ field: string | null; min: string | number | null; max: string | number | null; }>();

	public field!: string;		// Set during OnInit
	public min: string | null = null;
	public minValue: number | null = null;
	public max: string | null = null;
	public maxValue: number | null = null;
	public alarmName: string | null = null;

	public readonly StandardFields = StandardFields;
	public readonly CycleDataFields = CycleDataFields;
	public readonly parseFloat = parseFloat;

	public ngOnInit()
	{
		this.field = this.useDefault ? DefaultField.name : StandardFields[0].name;
	}

	public get isNumericField()
	{
		const def = findFieldDef(this.field);
		if (!def) return false;
		return def.type === "number";
	}

	public get fieldNeedsSpecify()
	{
		return fieldNeedsSpecify(this.field);
	}

	public get validAlarmName()
	{
		if (!this.alarmName) return false;
		return /^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*$/.test(this.alarmName);
	}

	private processMinMax(minmax: string | null, custom: number | null): string | number | null
	{
		if (!this.isNumericField) return null;
		if (minmax === null) return null;
		minmax = minmax.trim();
		if (minmax === CustomValue) return (custom == null) ? null : custom;
		if (minmax.length <= 0) return null;
		if (minmax[0] === "_") {
			if (minmax.length <= 1) return null;
			minmax = minmax.substr(1).trim();
		}
		if (/^\d+(\.\d*)?$/.test(minmax)) return parseFloat(minmax);
		return minmax;
	}

	public doAdd()
	{
		let fieldkey: string | null = this.field;
		if (this.field === DefaultField.name) fieldkey = null;
		if (this.alarmName && fieldNeedsSpecify(fieldkey)) fieldkey += this.alarmName.trim().toUpperCase();

		this.addEvent.emit({
			field: fieldkey,
			min: this.processMinMax(this.min, this.minValue),
			max: this.processMinMax(this.max, this.maxValue)
		});
	}
}
