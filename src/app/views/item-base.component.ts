import { Input, Output, EventEmitter } from "@angular/core";
import { Config } from "../app.config";

export class ItemBaseComponent<K, T extends object>
{
	@Input() public readonly info!: Wrapped<T>;
	@Output("edit") public readonly editEvent = new EventEmitter();

	public get i18n() { return Config.i18n; }

	protected getKey(item: T): K { throw new Error("Not implemented."); }
}
