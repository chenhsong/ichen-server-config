import { Input, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";

export class ItemBaseComponent<K, T extends {}>
{
	@Input() public readonly i18n!: ITranslationDictionary;

	@Input() public readonly info!: T & IWrapper;
	@Input() public readonly changeStream!: Observable<K>;
	@Output("edit") public readonly editEvent = new EventEmitter();

	protected getKey(item: T): K { throw new Error("Not implemented."); }
}
