import { Input, Output, EventEmitter } from "@angular/core";

export class ItemBaseComponent<K, T extends object>
{
	@Input() public readonly i18n!: ITranslationDictionary;

	@Input() public readonly info!: T & IWrapper;
	@Output("edit") public readonly editEvent = new EventEmitter();

	protected getKey(item: T): K { throw new Error("Not implemented."); }
}
