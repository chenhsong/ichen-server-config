import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ItemBaseComponent } from "./item-base.component";
import { Config } from "../app.config";

@Component({
	selector: "ichen-user",
	templateUrl: "../templates/user.component.html"
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
