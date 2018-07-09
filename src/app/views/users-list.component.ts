import { Component, Input, Output } from "@angular/core";
import { Http } from "@angular/http";
import { Config } from "../app.config";
import { ItemsListBaseComponent } from "./items-list-base.component";

@Component({
	selector: "ichen-users-list",
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
			(filterChanged)="filterChanged($event)">
		</ichen-list-header>

		<div id="imgLoading" *ngIf="isBusy" class="text-center">
			<img src="images/common/loading.gif" />
		</div>

		<div id="imgError" *ngIf="isError"><img src="images/common/error.png" /></div>

		<ichen-user-editor class="ichen-user ichen-edit" [i18n]="i18n"
			[title]="i18n.labelNewUser"
			*ngIf="isEditing(newItem,true)"
			(save)="onAddAsync($event)"
			(close)="editItem(null)">
		</ichen-user-editor>

		<div class="ichen-user ichen-list-container">
			<div *ngFor="let user of itemStream|async; trackBy:trackItems">
				<ichen-user *ngIf="isEditing(user,false)" class="ichen-user ichen-list-item" [i18n]="i18n"
					[info]="user"
					[password]="user.password"
					[name]="user.name"
					[accessLevel]="user.accessLevel"
					[enabled]="user.isEnabled"
					(edit)="editItem(user)">
				</ichen-user>

				<ichen-user-editor *ngIf="isEditing(user,true)" class="ichen-user ichen-edit ichen-list-item" [i18n]="i18n"
					[title]="i18n.labelEditUser+': '+user.name"
					[info]="user"
					[password]="user.password"
					[name]="user.name"
					[accessLevel]="user.accessLevel"
					[enabled]="user.isEnabled"
					(save)="onSaveAsync(user,$event)"
					(delete)="onDeleteAsync(user,$event)"
					(close)="editItem(null)">
				</ichen-user-editor>
			</div>
		</div>
	`
})
export class UsersListComponent extends ItemsListBaseComponent<IUser>
{
	constructor(http: Http) { super(http); }

	protected checkFilter(user: IUser, filter: string)
	{
		const ftext = filter.toUpperCase();

		// The filter should match substrings of either the user name or password
		return user.name.toUpperCase().indexOf(ftext) >= 0 || user.password.toUpperCase().indexOf(ftext) >= 0;
	}

	protected get urlGet() { return Config.URL.users; }

	protected get itemKeyField() { return "id"; }

	protected sortList(list: (IUser & IWrapper)[])
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
			name: "New User",
			password: "",
			accessLevel: 0,
			isEnabled: true,
			filters: "None"
		} as IUser & IWrapper;
	}
}
