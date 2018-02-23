import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import cloneObject from "../components/clone-object";

@Component({
	selector: "ichen-user-editor",
	template: `
		<form class="card">
			<div class="card-header badge-primary">
				<span (click)="closeEvent.emit()" class="ichen-close close">&times;</span>
				{{title}}
				<span *ngIf="filters.All">[{{i18n.labelAdministrator}}]</span>
			</div>
			<div class="card-body">
				<div class="row">
					<div class="ichen-edit-name form-group col-md-6" [class.has-danger]="!isInputValid(name)">
						<div class="input-group">
							<span class="input-group-addon">{{i18n.labelUserName}}</span>

							<input type="text" class="form-control form-control-danger" placeholder="{{i18n.labelUserName}}"
										 name="input-name"
										 [(ngModel)]="name"
										 (input)="dirty=true"
										 (change)="$event.target.value=name.trim()"
							/>
						</div>
					</div>

					<div class="ichen-edit-password form-group col-md-6" [class.has-danger]="!isInputValid(password)">
						<div class="input-group">
							<span class="input-group-addon">{{i18n.labelPassword}}</span>

							<input type="text" class="form-control form-control-danger" placeholder="{{i18n.labelPassword}}"
										 name="input-password"
										 [(ngModel)]="password"
										 (input)="dirty=true"
										 (change)="$event.target.value=password.trim()"
							/>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="ichen-edit-accessLevel form-group col-md-5">
						<div class="input-group">
							<span class="input-group-addon" [class.badge-danger]="accessLevel<=0">{{i18n.labelAccessLevel}}</span>
							<div class="form-control justify-content-center" [textContent]="accessLevel"></div>
							<div class="input-group-btn">
								<button type="button" (click)="changeAccessLevel(-1)" [disabled]="accessLevel<=0" class="btn btn-secondary"><span class="glyphicon glyphicon-chevron-down"></span></button>
								<button type="button" (click)="changeAccessLevel(+1)" [disabled]="accessLevel>=10" class="btn btn-secondary"><span class="glyphicon glyphicon-chevron-up"></span></button>
							</div>
						</div>
					</div>

					<div *ngIf="!filters.All" class="col-md-4"></div>

					<div *ngIf="!filters.All" class="ichen-edit-isEnabled form-group col-md-3">
						<div class="input-group">
							<div class="form-control"><input type="checkbox" name="input-enabled" [(ngModel)]="enabled" (change)="dirty=true" /></div>
							<div class="input-group-addon justify-content-center" [class.badge-success]="enabled" [class.badge-danger]="!enabled"><span *ngIf="enabled">{{i18n.labelEnabled}}</span><span *ngIf="!enabled">{{i18n.labelDisabled}}</span></div>
						</div>
					</div>
				</div>

				<div *ngIf="!filters.All" class="ichen-edit-filters form-group">
					<div class="input-group">
						<span class="input-group-addon">Open<br />Protocol<br />{{i18n.labelFilters}}</span>
						<div class="form-control"><div>
							<span class="choice"><input name="input-filter-status" [(ngModel)]="filters.Status" (change)="dirty=true" type="checkbox" /><label>{{i18n.labelFilterStatus}}</label></span>
							<span class="choice"><input name="input-filter-cycle" [(ngModel)]="filters.Cycle" (change)="dirty=true" type="checkbox" /><label>{{i18n.labelFilterCycle}}</label></span>
							<span class="choice"><input name="input-filter-mold" [(ngModel)]="filters.Mold" (change)="dirty=true" type="checkbox" /><label>{{i18n.labelFilterMold}}</label></span>
							<span class="choice"><input name="input-filter-actions" [(ngModel)]="filters.Actions" (change)="dirty=true" type="checkbox" /><label>{{i18n.labelFilterActions}}</label></span>
							<span class="choice"><input name="input-filter-alarms" [(ngModel)]="filters.Alarms" (change)="dirty=true" type="checkbox" /><label>{{i18n.labelFilterAlarms}}</label></span>
							<span class="choice"><input name="input-filter-audit" [(ngModel)]="filters.Audit" (change)="dirty=true" type="checkbox" /><label>{{i18n.labelFilterAudit}}</label></span>
							<span class="choice"><input name="input-filter-jobcards" [(ngModel)]="filters.JobCards" (change)="dirty=true" type="checkbox" /><label>{{i18n.labelFilterJobCards}}</label></span>
							<span class="choice"><input name="input-filter-operators" [(ngModel)]="filters.Operators" (change)="dirty=true" type="checkbox" /><label>{{i18n.labelFilterOperators}}</label></span>
							<span class="choice"><input name="input-filter-opcua" [(ngModel)]="filters.OPCUA" (change)="dirty=true" type="checkbox" /><label>{{i18n.labelFilterOPCUA}}</label></span>
						</div></div>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>

			<div class="card-footer buttons-strip">
				<button type="submit" [disabled]="!canSave()" (click)="onSave($event)" class="btn btn-success first"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;&nbsp;{{i18n.btnSave}}</button>
				<button type="button" *ngIf="!!info && !filters.All" (click)="onDelete($event)" class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span>&nbsp;&nbsp;{{i18n.btnDelete}}</button>
				<button type="button" (click)="closeEvent.emit()" class="btn btn-secondary last"><span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;{{i18n.btnCancel}}</button>
				<div class="clearfix"></div>
			</div>
		</form>
	`
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
			(this.filters as any)[key] = true;
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
