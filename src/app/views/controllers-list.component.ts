import { Component, Input, Output } from "@angular/core";
import { Http } from "@angular/http";
import { Config } from "../app.config";
import { ItemsListBaseComponent } from "./items-list-base.component";

@Component({
	selector: "ichen-controllers-list",
	templateUrl: "../templates/controllers-list.component.html"
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
