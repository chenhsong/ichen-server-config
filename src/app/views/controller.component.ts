import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ItemBaseComponent } from "./item-base.component";

@Component({
	selector: "ichen-controller",
	templateUrl: "../templates/controller.component.html"
})
export class ControllerComponent extends ItemBaseComponent<number, IController>
{
	protected getKey(item: IController & IWrapper) { return item.id; }
}
