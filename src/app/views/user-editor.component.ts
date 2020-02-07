import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Config } from "../app.config";
import { IUser, IFilters, Filters, Dictionary } from "../interfaces";

@Component({
	selector: "ichen-user-editor",
	templateUrl: "../templates/user-editor.component.html"
})
export class UserEditorComponent implements OnInit
{
	@Input() public readonly title: string | null = null;
	@Input() public readonly info!: IUser;
	@Input() public name = "";
	@Input() public password = "";
	@Input() public accessLevel = 0;
	@Input() public enabled = true;

	@Output("close") public readonly closeEvent = new EventEmitter();
	@Output("save") public readonly saveEvent = new EventEmitter<IUser>();
	@Output("delete") public readonly deleteEvent = new EventEmitter<IUser>();

	public get i18n() { return Config.i18n; }

	public dirty = false;
	public filters: IFilters = {
		Status: false,
		Cycle: false,
		Mold: false,
		Actions: false,
		Alarms: false,
		Audit: false,
		All: false,
		JobCards: false,
		Operators: false,
		OPCUA: false
	};

	public ngOnInit()
	{
		// Build the filters object
		const filters_list = ((this.info && this.info.filters) || "").replace(/ /g, "").split(",") as Filters[];

		for (const key of filters_list) {
			(this.filters as unknown as Dictionary<unknown>)[key] = true;
		}
	}

	public isInputValid(text: string)
	{
		return !!text.trim();
	}

	public canSave()
	{
		if (!this.dirty) return false;
		if (!this.isInputValid(this.name)) return false;
		if (!this.isInputValid(this.password)) return false;
		return true;
	}

	public onSave(ev: Event)
	{
		ev.preventDefault();

		if (!this.canSave()) return;

		const delta = {} as IUser;
		if (!this.info || this.info.name !== this.name) delta.name = this.name.trim();
		if (!this.info || this.info.password !== this.password) delta.password = this.password.trim();
		if (!this.info || this.info.accessLevel !== this.accessLevel) delta.accessLevel = this.accessLevel;
		if (!this.info || this.info.isEnabled !== this.enabled) delta.isEnabled = this.enabled;

		const filters_list: string[] = [];

		if (this.filters.All) {
			filters_list.push("All");
		} else {
			if (this.filters.Status) filters_list.push("Status");
			if (this.filters.Cycle) filters_list.push("Cycle");
			if (this.filters.Mold) filters_list.push("Mold");
			if (this.filters.Actions) filters_list.push("Actions");
			if (this.filters.Alarms) filters_list.push("Alarms");
			if (this.filters.Audit) filters_list.push("Audit");
		}

		if (this.filters.JobCards) filters_list.push("JobCards");
		if (this.filters.Operators) filters_list.push("Operators");
		if (this.filters.OPCUA) filters_list.push("OPCUA");

		const text = filters_list.join(", ") || "None";
		if (!this.info || this.info.filters !== text) delta.filters = text;

		this.saveEvent.emit(delta);
	}

	public onDelete(ev: Event)
	{
		ev.preventDefault();

		if (!confirm(this.i18n.textConfirmDeleteUser.replace("{0}", this.info.name))) return;
		this.deleteEvent.emit(this.info);
	}

	public changeAccessLevel(delta: number)
	{
		const old_level = this.accessLevel;

		let level = old_level + delta;
		if (level > 10) level = 10;
		if (level <= 0) level = 0;

		if (old_level !== level) {
			this.accessLevel = level;
			this.dirty = true;
		}
	}
}
