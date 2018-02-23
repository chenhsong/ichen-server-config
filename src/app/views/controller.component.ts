import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ItemBaseComponent } from "./item-base.component";

@Component({
	selector: "ichen-controller",
	template: `
		<div class="input-group input-group-sm">
			<div class="input-group-addon ichen-controller-id" [class.badge-danger]="info.isError">
				<img *ngIf="info.isSaving" class="extra-content" src="images/common/loading.gif" />
				<span>{{info.id}}</span>
			</div>
			<div class="form-control" [ngClass]="{'disabled':!info.isEnabled}">
				<div class="fill">
					<span *ngIf="info.isEnabled" class="text-success glyphicon glyphicon-ok"></span>
					<span *ngIf="!info.isEnabled" class="text-danger glyphicon glyphicon-remove"></span>
					&nbsp;
					<span class="ichen-controller-name">{{info.name}}</span>
					<span class="extra-content">{{info.model}} ({{info.type}}) @ {{info.IP}}</span>
				</div>
			</div>
			<div class="input-group-addon command">
				<button type="button" [disabled]="info.isSaving" (click)="editEvent.emit()" class="ichen-edit btn btn-sm"><span class="glyphicon glyphicon-pencil"></span></button>
			</div>
		</div>
	`
})
export class ControllerComponent extends ItemBaseComponent<number, IController>
{
	protected getKey(item: IController & IWrapper) { return item.id; }
}
