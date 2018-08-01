import { Component, Input, Output, EventEmitter } from "@angular/core";
import { IFieldDef, NullField } from "../components/fields";
import { Transform } from "../components/map-field-name.pipe";
import OpModes from "../components/op-modes";
import JobModes from "../components/job-modes";
import Actions from "../components/actions";

@Component({
	selector: "ichen-terminal-value-map-editor",
	template: `
		<div class="card">
			<div class="card-header badge-info">
				<span (click)="closeEvent.emit()" class="ichen-close close float-right">&times;</span>
				{{title}}
			</div>
			<div class="card-body">
				<!-- Data field -->
				<div *ngIf="!!info.field" class="input-group input-group-smxxx">
					<div class="input-group-prepend"><span class="input-group-text">{{i18n.labelField}}</span></div>

					<div class="form-control">{{transform(fieldType.name)}}</div>
				</div>

				<!-- Data entry -->
				<div [ngSwitch]="fieldType?.type" class="input-group input-group-smxxx">
					<div class="input-group-prepend"><span (click)="toggleNegated()" class="input-group-text negation">
						<span *ngIf="!negated">{{i18n.labelEqualsTo}}</span>
						<span *ngIf="negated">{{i18n.labelNotEqualsTo}}</span>
					</span></div>

					<div *ngSwitchCase="'null'" class="form-control"></div>
					<div *ngSwitchCase="'boolean'" class="form-control">
						<input name="input-value" type="checkbox" [ngModel]="!!currValue" (change)="changeValue(!!$event.target.checked)" />
						&nbsp;&nbsp;
						<span>{{i18n[!!currValue ? "labelTrue" : "labelFalse"]}}</span>
					</div>
					<input name="input-value" *ngSwitchCase="'string'" placeholder="{{i18n.labelBlank}}" [ngModel]="currValue?.toString()||''" (change)="changeValue($event.target.value)" class="form-control" />
					<input name="input-value" *ngSwitchCase="'ID'" placeholder="{{i18n.labelNothing}}" [ngModel]="currValue?.toString()" (change)="changeValue(!$event.target.value.trim()?null:parseFloat($event.target.value))" class="form-control" />
					<input name="input-value" *ngSwitchCase="'number'" placeholder="{{i18n.labelNothing}}" [ngModel]="currValue?.toString()" (change)="changeValue(!$event.target.value.trim()?null:parseFloat($event.target.value))" class="form-control" />
					<input name="input-value" *ngSwitchCase="'Date'" [ngModel]="currValue?.toString()" (change)="changeValue($event.target.value)" class="form-control" />
					<select name="input-value" *ngSwitchCase="'OpModes'" [ngModel]="currValue||'null'" (change)="changeValue($event.target.value,true)" class="custom-select">
							<option value="null">{{i18n.labelNothing}}</option>
							<option *ngFor="let opt of opModes" value="{{opt.name}}">{{i18n[opt.description]}}</option>
					</select>
					<select name="input-value" *ngSwitchCase="'JobModes'" [ngModel]="currValue||'null'" (change)="changeValue($event.target.value,true)" class="custom-select">
							<option value="null">{{i18n.labelNothing}}</option>
							<option *ngFor="let opt of jobModes" value="{{opt.name}}">{{i18n[opt.description]}}</option>
					</select>
					<select name="input-value" *ngSwitchCase="'Actions'" [ngModel]="currValue?.toString()||'0'" (change)="changeValue($event.target.value=='0'?null:parseInt($event.target.value,10),true)" class="custom-select">
							<option value="0">{{i18n.labelNothing}}</option>
							<option *ngFor="let opt of actions" value="{{opt.id}}">{{i18n[opt.description]}}</option>
					</select>
					<div *ngSwitchDefault class="form-control">{{i18n.labelUnknown}}</div>
				</div>

				<!-- Formatting -->
				<ichen-terminal-formatting [i18n]="i18n"
					[classes]="info.class"
					[textColors]="textColors"
					[backgroundColors]="backgroundColors"
					(classesChanged)="info.class=$event; changeEvent.emit(info);">
				</ichen-terminal-formatting>
			</div>

			<div class="card-footer buttons-strip">
				<button type="button" (click)="deleteEvent.emit(info)" class="btn btn-sm btn-danger"><span class="glyphicon glyphicon-trash"></span>&nbsp;&nbsp;{{i18n.btnDelete}}</button>
				<button type="button" (click)="closeEvent.emit()" class="btn btn-sm btn-secondary last"><span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;{{i18n.btnClose}}</button>
			</div>
		</div>
	`
})
export class TerminalValueMapEditorComponent
{
	@Input() public readonly i18n!: ITranslationDictionary;

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
