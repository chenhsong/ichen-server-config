import { Component, Input, Output } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Config } from "../app.config";
import { IController, IWrapper } from "../interfaces";
import { ItemsListBaseComponent } from "./items-list-base.component";
import { Transform as mapControllerType } from "../components/map-controller-type.pipe";

@Component({
	selector: "ichen-controllers-list",
	templateUrl: "../templates/controllers-list.component.html"
})
export class ControllersListComponent extends ItemsListBaseComponent<IController>
{
	protected mapControllerType = mapControllerType;

	constructor(http: HttpClient) { super(http); }

	protected checkFilter(controller: IController, filter: string)
	{
		const text = filter.toUpperCase();

		// The filter should match substrings of either the controller name or id
		return controller.name.toUpperCase().indexOf(text) >= 0 || controller.id.toString().indexOf(text) >= 0;
	}

	protected get urlGet() { return Config.URL.controllers; }

	protected get itemKeyField() { return "id"; }

	protected sortList(list: (IController & IWrapper)[])
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
			id: 0,
			name: "New Machine",
			isEnabled: true,
			type: 6,
			model: "Unknown Model",
			version: "Unknown",
			IP: "0.0.0.0:0"
		} as IController & IWrapper;
	}
}
