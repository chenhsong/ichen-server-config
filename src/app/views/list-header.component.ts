import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Config } from "../app.config";

@Component({
	selector: "ichen-list-header",
	templateUrl: "../templates/list-header.component.html"
})
export class ListHeaderComponent
{
	@Input() public readonly newEnabled = true;
	@Input() public readonly newVisible = true;
	@Input() public readonly reloadEnabled = true;
	@Input() public readonly reloadVisible = true;
	@Input() public readonly filterEnabled = true;
	@Input() public readonly filterVisible = true;

	@Output("new") public readonly newEvent = new EventEmitter();
	@Output("reload") public readonly reloadEvent = new EventEmitter();
	@Output("filterChanged") public readonly filterChangedEvent = new EventEmitter<string>();

	public get i18n() { return Config.i18n; }
}
