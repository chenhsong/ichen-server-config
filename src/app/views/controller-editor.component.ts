import { Component, Input, Output, EventEmitter } from "@angular/core";
import ControllerTypes from "../components/controllers";
import { Config } from "../app.config";

@Component({
	selector: "ichen-controller-editor",
	templateUrl: "../templates/controller-editor.component.html"
})
export class ControllerEditorComponent
{
	@Input() public readonly title: string | null = null;
	@Input() public readonly info!: IController;
	@Input() public id = "";
	@Input() public name = "";
	@Input() public enabled = true;
	@Input() public readonly type!: ControllerTypes;
	@Input() public readonly model!: string;
	@Input() public readonly version!: string;
	@Input() public readonly IP = "0.0.0.0:0";

	@Output("close") public readonly closeEvent = new EventEmitter();
	@Output("save") public readonly saveEvent = new EventEmitter<IController>();
	@Output("delete") public readonly deleteEvent = new EventEmitter<IController>();

	public get i18n() { return Config.i18n; }

	public dirty = false;
	public readonly controllerTypes = ControllerTypes;
	public readonly parseInt = parseInt;

	public isNumeric(text: string) { return /^\s*\d+\s*$/.test(text) && !/^\s*0+\s*$/.test(text); }

	public isInputValid(text: string) { return !!text.trim(); }

	public canSave()
	{
		if (!this.dirty) return false;
		if (!this.isInputValid(this.id)) return false;
		if (!this.isInputValid(this.name)) return false;
		return true;
	}

	public onSave(ev: Event)
	{
		ev.preventDefault();

		if (!this.canSave()) return;

		const delta = {} as IController;
		if (!this.info || this.info.id !== parseInt(this.id, 10)) delta.id = parseInt(this.id, 10);
		if (!this.info || this.info.name !== this.name) delta.name = this.name.trim();
		if (!this.info || this.info.isEnabled !== this.enabled) delta.isEnabled = this.enabled;
		if (!this.info || this.info.type !== this.type) delta.type = this.type;
		if (!this.info || this.info.model !== this.model) delta.model = this.model;
		if (!this.info || this.info.version !== this.version) delta.version = this.version;
		if (!this.info || this.info.IP !== this.IP) delta.IP = this.IP;

		this.saveEvent.emit(delta);
	}

	public onDelete(ev: Event)
	{
		ev.preventDefault();

		if (!confirm(this.i18n.textConfirmDeleteMachine.replace("{0}", `(${this.info.id}) ${this.info.name}`))) return;
		this.deleteEvent.emit(this.info);
	}
}
