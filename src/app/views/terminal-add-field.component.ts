﻿import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { fieldNeedsSpecify, findFieldDef, StandardFields, CycleDataFields, DefaultField } from "../components/fields";
import { Config } from "../app.config";

const CustomValue = "__CUSTOM__";

@Component({
	selector: "ichen-terminal-add-field",
	templateUrl: "../templates/terminal-add-field.component.html"
})
export class TerminalAddFieldComponent implements OnInit
{
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

	public get i18n() { return Config.i18n; }

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

	private processMinMax(min_max: string | null, custom: number | null): string | number | null
	{
		if (!this.isNumericField) return null;
		if (min_max === null) return null;
		min_max = min_max.trim();
		if (min_max === CustomValue) return (custom == null) ? null : custom;
		if (min_max.length <= 0) return null;
		if (min_max[0] === "_") {
			if (min_max.length <= 1) return null;
			min_max = min_max.substr(1).trim();
		}
		if (/^\d+(\.\d*)?$/.test(min_max)) return parseFloat(min_max);
		return min_max;
	}

	public doAdd()
	{
		let field_key: string | null = this.field;
		if (this.field === DefaultField.name) field_key = null;
		if (this.alarmName && fieldNeedsSpecify(field_key)) field_key += this.alarmName.trim().toUpperCase();

		this.addEvent.emit({
			field: field_key,
			min: this.processMinMax(this.min, this.minValue),
			max: this.processMinMax(this.max, this.maxValue)
		});
	}
}
