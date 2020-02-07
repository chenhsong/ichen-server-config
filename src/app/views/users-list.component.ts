import { Component, Input, Output } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Config } from "../app.config";
import { IUser, IWrapper } from "../interfaces";
import { ItemsListBaseComponent } from "./items-list-base.component";

@Component({
	selector: "ichen-users-list",
	templateUrl: "../templates/users-list.component.html"
})
export class UsersListComponent extends ItemsListBaseComponent<IUser>
{
	constructor(http: HttpClient) { super(http); }

	protected checkFilter(user: IUser, filter: string)
	{
		const text = filter.toUpperCase();

		// The filter should match substrings of either the user name or password
		return user.name.toUpperCase().indexOf(text) >= 0 || user.password.toUpperCase().indexOf(text) >= 0;
	}

	protected get urlGet() { return Config.URL.users; }

	protected get itemKeyField() { return "id"; }

	protected sortList(list: (IUser & IWrapper)[])
	{
		return list.sort((a, b) =>
		{
			const name_a = a.name.toLowerCase();
			const name_b = b.name.toLowerCase();

			return (name_a < name_b) ? -1 : (name_a > name_b) ? + 1 : 0;
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
