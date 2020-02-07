import { Component, Input, Output, EventEmitter } from "@angular/core";
import { IFieldDef, NullField } from "../components/fields";
import { Transform } from "../components/map-field-name.pipe";
import OpModes from "../components/op-modes";
import JobModes from "../components/job-modes";
import Actions from "../components/actions";
import { Config } from "../app.config";
import * as Terminal from "../terminal-config"

@Component({
	selector: "ichen-terminal-value-map-editor",
	templateUrl: "../templates/terminal-value-map-editor.component.html"
})
export class TerminalValueMapEditorComponent
{
	@Input() public readonly title: string | null = null;
	@Input() public readonly info!: Terminal.IClassMap;
	@Input() public readonly fieldType: IFieldDef | null = null;
	@Input() public negated = false;
	@Input() public readonly textColors = true;
	@Input() public readonly backgroundColors = true;
	@Output("valueMapChanged") public readonly changeEvent = new EventEmitter<Terminal.IClassMap>();
	@Output("delete") public readonly deleteEvent = new EventEmitter<Terminal.IClassMap>();
	@Output("close") public readonly closeEvent = new EventEmitter<void>();

	public readonly console = console;
	public readonly parseInt = parseInt;
	public readonly parseFloat = parseFloat;
	public readonly transform = Transform;

	public readonly opModes = OpModes;
	public readonly jobModes = JobModes;
	public readonly actions = Actions;

	public get i18n() { return Config.i18n; }

	public get currValue()
	{
		return this.negated
			? (this.info as Terminal.IClassMapNegatedValueBase).notValue
			: (this.info as Terminal.IClassMapValueBase).value;
	}

	public toggleNegated()
	{
		if (this.negated) {
			const map = this.info as Terminal.IClassMapNegatedValueBase;
			(this.info as Terminal.IClassMapValueBase).value = map.notValue;
			delete map.notValue;
		} else {
			const map = this.info as Terminal.IClassMapValueBase;
			(this.info as Terminal.IClassMapNegatedValueBase).notValue = map.value;
			delete map.value;
		}

		this.negated = !this.negated;
		this.changeEvent.emit(this.info);
	}

	public changeValue(value: unknown, checkNothing = false)
	{
		if (checkNothing && value === NullField.name) value = null;

		if (this.negated) {
			(this.info as Terminal.IClassMapNegatedValueBase).notValue = value;
		} else {
			(this.info as Terminal.IClassMapValueBase).value = value;
		}
		this.changeEvent.emit(this.info);
	}
}
