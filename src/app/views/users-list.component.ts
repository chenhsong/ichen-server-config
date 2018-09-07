import { Component, Input, Output } from "@angular/core";
import { Http } from "@angular/http";
import { Config } from "../app.config";
import { ItemsListBaseComponent } from "./items-list-base.component";

@Component({
	selector: "ichen-users-list",
	templateUrl: "../templates/users-list.component.html"
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
