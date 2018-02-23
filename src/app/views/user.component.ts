import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ItemBaseComponent } from "./item-base.component";
import { Observable } from "rxjs/Rx";
import { Config } from "../app.config";

@Component({
	selector: "ichen-user",
	template: `
		<div class="input-group input-group-sm">
			<div class="input-group-addon ichen-user-name" [class.badge-danger]="info.isError">
				<img *ngIf="info.isSaving" class="extra-content" src="images/common/loading.gif" />
				<span>{{info.name}} (<span [ngClass]="{'text-danger':info.accessLevel<=0}">{{info.accessLevel}}</span>)</span>
			</div>
			<div class="form-control" [ngClass]="{'disabled':!info.isEnabled}">
				<div class="fill">
					<span *ngIf="isAdmin" class="admin-account glyphicon glyphicon-lock"></span>
					<span *ngIf="!isAdmin">
						<span *ngIf="info.isEnabled" class="text-success glyphicon glyphicon-ok"></span>
						<span *ngIf="!info.isEnabled" class="text-danger glyphicon glyphicon-remove"></span>
					</span>
					&nbsp;
					<span class="ichen-user-password">{{info.password}}</span>
					<span class="extra-content">{{filtersText}}</span>
				</div>
			</div>
			<div class="input-group-addon command">
				<button type="button" [disabled]="info.isSaving" (click)="editEvent.emit()" class="ichen-edit btn btn-sm btn-light"><span class="glyphicon glyphicon-pencil"></span></button>
			</div>
		</div>
	`
})
export class UserComponent extends ItemBaseComponent<number, IUser>
{
	@Input() public readonly i18n!: ITranslationDictionary;

	@Input() public readonly info!: IUser & IWrapper;
	@Input() public readonly name = "";
	@Input() public readonly password = "";
	@Input() public readonly accessLevel = 0;
	@Input() public readonly enabled = true;
	@Input() public readonly isAdmin = false;
	@Input() public readonly changeStream!: Observable<number>;
	@Output("edit") public readonly editEvent = new EventEmitter();

	protected getKey(item: IUser & IWrapper) { return item.id; }

	public get filtersText()
	{
		return this.info.filters.split(",")
			.map(filter => filter.trim())
			.map(filter => Config.lang === "en" ? filter : (this.i18n["labelFilter" + filter] || filter))
			.join(", ");
	}
}
