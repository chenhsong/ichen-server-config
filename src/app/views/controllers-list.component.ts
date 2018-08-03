import { Component, Input, Output } from "@angular/core";
import { Http } from "@angular/http";
import { Config } from "../app.config";
import { ItemsListBaseComponent } from "./items-list-base.component";

@Component({
	selector: "ichen-controllers-list",
	template: `
		<ichen-list-header [i18n]="i18n"
			[newEnabled]="!isBusy&&!isEditing(newItem,true)"
			[newVisible]="true"
			(new)="createNew()"

			[reloadEnabled]="!isBusy"
			[reloadVisible]="!isEditing(newItem,true)"
			(reload)="reloadAsync()"

			[filterEnabled]="!isBusy&&!isError"
			[filterVisible]="!isEditing(newItem,true)"
			(filterChanged)="filterChanged($event)"
		></ichen-list-header>

		<div id="imgLoading" *ngIf="isBusy" class="text-center">
			<img src="images/common/loading.gif" />
		</div>

		<div id="imgError" *ngIf="isError"><img src="images/common/error.png" /></div>

		<ichen-controller-editor [i18n]="i18n"
			class="ichen-controller ichen-edit"
			[title]="i18n.labelNewMachine"
			*ngIf="isEditing(newItem,true)"
			(save)="onAddAsync($event)"
			(close)="editItem(null)">
		</ichen-controller-editor>

		<div class="ichen-controller ichen-list-container">
			<div *ngFor="let controller of itemStream|async; trackBy:trackItems">
				<ichen-controller [i18n]="i18n"
					class="ichen-controller ichen-list-item"
					[info]="controller"
					*ngIf="isEditing(controller,false)"
					(edit)="editItem(controller)">
				</ichen-controller>

				<ichen-controller-editor [i18n]="i18n"
					class="ichen-controller ichen-edit ichen-list-item"
					[title]="i18n.labelEditMachine+': '+controller.name+' ('+controller.model+', '+controller.type+') @ '+controller.IP"
					[info]="controller"
					[id]="controller.id.toString()"
					[name]="controller.name"
					[enabled]="controller.isEnabled"
					[type]="controller.type"
					[model]="controller.model"
					[version]="controller.version"
					[IP]="controller.IP"
					*ngIf="isEditing(controller,true)"
					(save)="onSaveAsync(controller,$event)"
					(delete)="onDeleteAsync(controller,$event)"
					(close)="editItem(null)">
				</ichen-controller-editor>
			</div>
		</div>
	`
})
export class ControllersListComponent extends ItemsListBaseComponent<IController>
{
	constructor(http: Http) { super(http); }

	protected checkFilter(controller: IController, filter: string)
	{
		const ftext = filter.toUpperCase();

		// The filter should match substrings of either the controller name or id
		return controller.name.toUpperCase().indexOf(ftext) >= 0 || controller.id.toString().indexOf(ftext) >= 0;
	}

	protected get urlGet() { return Config.URL.controllers; }

	protected get itemKeyField() { return "id"; }

	protected sortList(list: (IController & IWrapper)[])
	{
		return list.sort((a, b) =>
		{
			const aname = a.name.toLowerCase();
			const bname = b.name.toLowerCase();

			return (aname < bname) ? -1 : (aname > bname) ? + 1 : 0;
		});
	}

	public getNewItem()
	{
		return {
			id: 0,
			name: "New controller",
			isEnabled: true,
			type: "Ai02",
			model: "Unknown Model",
			version: "Unknown",
			IP: "0.0.0.0:0"
		} as IController & IWrapper;
	}
}
