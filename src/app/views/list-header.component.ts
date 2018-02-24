import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Config } from "../app.config";

@Component({
	selector: "ichen-list-header",
	template: `
		<div class="header row">
			<div class="col-md-5 col-xl-4">
				<button [disabled]="!newEnabled" *ngIf="newVisible" (click)="newEvent.emit()" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;{{i18n.btnNew}}</button>
				&nbsp;&nbsp;
				<button [disabled]="!reloadEnabled" *ngIf="reloadVisible" (click)="reloadEvent.emit()" class="btn btn-secondary"><span class="glyphicon glyphicon-refresh"></span>&nbsp;&nbsp;{{i18n.btnReload}}</button>
			</div>
			<div class="col-md-7 col-xl-8" *ngIf="filterVisible">
				<div class="input-group">
					<div class="input-group-prepend"><span class="input-group-text"><span class="glyphicon glyphicon-search"></span>&nbsp;&nbsp;{{i18n.labelFilter}}</span></div>
					<input [disabled]="!filterEnabled" (input)="filterChangedEvent.emit($event.target.value)" class="form-control" placeholder="{{i18n.textSearchText}}" />
				</div>
			</div>
		</div>
	`
})
export class ListHeaderComponent
{
	@Input() public readonly i18n!: ITranslationDictionary;
	@Input() public readonly newEnabled = true;
	@Input() public readonly newVisible = true;
	@Input() public readonly reloadEnabled = true;
	@Input() public readonly reloadVisible = true;
	@Input() public readonly filterEnabled = true;
	@Input() public readonly filterVisible = true;

	@Output("new") public readonly newEvent = new EventEmitter();
	@Output("reload") public readonly reloadEvent = new EventEmitter();
	@Output("filterChanged") public readonly filterChangedEvent = new EventEmitter<string>();
}
