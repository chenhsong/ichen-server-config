import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

@Component({
	selector: "ichen-user-editor",
	templateUrl: "../templates/user-editor.component.html"
})
export class UserEditorComponent implements OnInit
{
	@Input() public readonly i18n!: ITranslationDictionary;

	@Input() public readonly title: string | null = null;
	@Input() public readonly info!: IUser;
	@Input() public name = "";
	@Input() public password = "";
	@Input() public accessLevel = 0;
	@Input() public enabled = true;

	@Output("close") public readonly closeEvent = new EventEmitter();
	@Output("save") public readonly saveEvent = new EventEmitter<IUser>();
	@Output("delete") public readonly deleteEvent = new EventEmitter<IUser>();

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
		const flist = ((this.info && this.info.filters) || "").replace(/ /g, "").split(",") as Filters[];

		for (const key of flist) {
			(this.filters as Dictionary<unknown>)[key] = true;
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

		const arfilters: string[] = [];

		if (this.filters.All) {
			arfilters.push("All");
		} else {
			if (this.filters.Status) arfilters.push("Status");
			if (this.filters.Cycle) arfilters.push("Cycle");
			if (this.filters.Mold) arfilters.push("Mold");
			if (this.filters.Actions) arfilters.push("Actions");
			if (this.filters.Alarms) arfilters.push("Alarms");
			if (this.filters.Audit) arfilters.push("Audit");
		}

		if (this.filters.JobCards) arfilters.push("JobCards");
		if (this.filters.Operators) arfilters.push("Operators");
		if (this.filters.OPCUA) arfilters.push("OPCUA");

		const fstr = arfilters.join(", ") || "None";
		if (!this.info || this.info.filters !== fstr) delta.filters = fstr;

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
		const oldlevel = this.accessLevel;

		let level = oldlevel + delta;
		if (level > 10) level = 10;
		if (level <= 0) level = 0;

		if (oldlevel !== level) {
			this.accessLevel = level;
			this.dirty = true;
		}
	}
}
