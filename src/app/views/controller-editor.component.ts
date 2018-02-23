import { Component, Input, Output, EventEmitter } from "@angular/core";
import ControllerTypes from "../components/controllers";

@Component({
	selector: "ichen-controller-editor",
	template: `
		<form class="card">
			<div class="card-header badge-primary">
				<span (click)="closeEvent.emit()" class="ichen-close close float-right">&times;</span>
				{{title}}
			</div>
			<div class="card-body">
				<div class="row">
					<div class="ichen-edit-id form-group col-md-5" [class.has-danger]="!isNumeric(id)">
						<div class="input-group">
							<span class="input-group-addon">{{i18n.labelSerialNum}}</span>

							<input type="text" class="form-control form-control-danger" placeholder="{{i18n.textMachineSerialNum}}" [disabled]="!!info"
										 name="input-id"
										 [(ngModel)]="id"
										 (input)="dirty=true"
										 (change)="$event.target.value=isNumeric(id)?parseInt(id.trim(),10).toString():id.trim()"
							/>
						</div>
					</div>

					<div class="col-md-4"></div>

					<div class="ichen-edit-isEnabled form-group col-md-3">
						<div class="input-group">
							<div class="form-control"><input type="checkbox" name="input-enabled" (change)="dirty=true" [(ngModel)]="enabled" /></div>
							<div class="input-group-addon justify-content-center" [class.badge-success]="enabled" [class.badge-danger]="!enabled"><span *ngIf="enabled">{{i18n.labelEnabled}}</span><span *ngIf="!enabled">{{i18n.labelDisabled}}</span></div>
						</div>
					</div>
				</div>

				<div class="ichen-edit-name form-group" [class.has-danger]="!isInputValid(name)">
					<div class="input-group">
						<span class="input-group-addon">{{i18n.labelMachineName}}</span>

						<input type="text" class="form-control form-control-danger" placeholder="{{i18n.textMachineName}}"
									 name="input-name"
						       [(ngModel)]="name"
						       (input)="dirty=true"
						       (change)="$event.target.value=name.trim()"
						/>
					</div>
				</div>
			</div>

			<div class="card-footer buttons-strip">
				<button type="submit" [disabled]="!canSave()" (click)="onSave($event)" class="btn btn-success first"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;&nbsp;{{i18n.btnSave}}</button>
				<button type="button" *ngIf="!!info" (click)="onDelete($event)" class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span>&nbsp;&nbsp;{{i18n.btnDelete}}</button>
				<button type="button" (click)="closeEvent.emit()" class="btn btn-secondary last"><span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;{{i18n.btnCancel}}</button>
				<div class="clearfix"></div>
			</div>
		</form>
	`
})
export class ControllerEditorComponent
{
	@Input() public readonly i18n!: ITranslationDictionary;

	@Input() public readonly title: string | null = null;
	@Input() public readonly info!: IController;
	@Input() public id = "";
	@Input() public name = "";
	@Input() public enabled = true;
	@Input() public readonly type!: ControllerTypes;
	@Input() public readonly model!: string;
	@Input() public readonly version!: string;
	@Input() public readonly IP = "127.0.0.1";

	@Output("close") public readonly closeEvent = new EventEmitter();
	@Output("save") public readonly saveEvent = new EventEmitter<IController>();
	@Output("delete") public readonly deleteEvent = new EventEmitter<IController>();

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
