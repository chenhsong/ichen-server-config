import { Http, Headers, Response } from "@angular/http";
import { Subject } from "rxjs";
import { BaseComponent } from "./base.component";
import { Config } from "../app.config";

export class ItemsListBaseComponent<T extends object> extends BaseComponent<Dictionary<T>>
{
	private static PostHeaders = new Headers({ "Content-Type": "application/json" });

	public filter = "";
	public newItem: (T & IWrapper) | null = null;
	public editingItem: T | null = null;
	public readonly itemStream = new Subject<(T & IWrapper)[]>();

	constructor(protected http: Http) { super(http); }

	public filterChanged(text: string)
	{
		this.filter = (text || "").trim();

		// Disable editing if it hides the controller currently being edited
		if (this.editingItem && !this.isEditing(this.editingItem, true)) this.editingItem = null;
	}

	protected getNewItem(): T & IWrapper
	{
		throw new Error("Not implemented.");
	}

	public createNew()
	{
		this.newItem = this.getNewItem();
		this.editItem(this.newItem);
	}

	public isEditing(item: T | null, editor: boolean)
	{
		if (!item) return false;
		if ((item === this.editingItem) !== editor) return false;

		// If no filter, pass all users
		if (!this.filter) return true;

		return this.checkFilter(item, this.filter);
	}

	protected checkFilter(item: T, filter: string): boolean { throw new Error("Not implemented."); }

	protected editItem(item: (T & IWrapper) | null)
	{
		if (this.isBusy) return;
		if (item && item.isSaving) return;

		this.editingItem = item;
	}

	protected get itemKeyField(): string { throw new Error("Not implemented."); }

	protected sortList(list: (T & IWrapper)[]) { return list; }

	public async reloadAsync()
	{
		this.editItem(null);
		this.itemStream.next([]);

		try {
			const items: Dictionary<T> = await super.reloadAsync();
			const list: (T & IWrapper)[] = [];

			for (const key in items) {
				if (!items.hasOwnProperty(key)) continue;
				const item = items[key] as T & IWrapper;
				list.push(item);
			}

			this.itemStream.next(this.sortList(list));

			return items;
		} catch (err) {
			console.error("Cannot get list.", err);

			// Assume any error is failure to login
			Config.jumpToPage();

			throw err;
		}
	}

	public async onAddAsync(newItem: T)
	{
		this.editingItem = null;
		console.log("Adding new item", newItem);

		try {
			const resp = await this.http.post(this.urlGet,
				JSON.stringify(newItem),
				{ headers: ItemsListBaseComponent.PostHeaders }
			).toPromise();

			console.log("Item successfully added.", resp);
			this.buildLoadingPipeline();
		} catch (err) {
			console.error(err);
			alert("Cannot add item! " + err);

			// Assume any error is failure to login
			Config.jumpToPage();
		}
	}

	public async onSaveAsync(oldItem: T & IWrapper, newItem: T)
	{
		this.editingItem = null;
		oldItem.isSaving = true;

		console.log("Saving changes", newItem);

		try {
			const resp = await this.http.post(`${this.urlGet}/${(oldItem as any)[this.itemKeyField]}`,
				JSON.stringify(newItem),
				{ headers: ItemsListBaseComponent.PostHeaders }
			).toPromise();

			const item = resp.json() as T;

			console.log("Changes successfully saved.", item);

			// Mixin the new item
			for (const key in item) {
				if (!item.hasOwnProperty(key)) continue;
				(oldItem as any)[key] = (item as any)[key];
			}
		} catch (err) {
			console.error(err);
			alert("Cannot save item! " + err);
			oldItem.isError = true;

			// Assume any error is failure to login
			Config.jumpToPage();
		} finally {
			oldItem.isSaving = false;
		}
	}

	public async onDeleteAsync(oldItem: T & IWrapper, item: T)
	{
		this.editingItem = null;
		oldItem.isSaving = true;

		console.log("Deleting item", item);

		try {
			const r = await this.http.delete(`${this.urlGet}/${(oldItem as any)[this.itemKeyField]}`).toPromise();

			console.log("Item successfully deleted.", item);
			this.buildLoadingPipeline();
		} catch (err) {
			console.error(err);
			alert("Cannot delete item! " + err);
			oldItem.isError = true;

			// Assume any error is failure to login
			Config.jumpToPage();
		} finally {
			oldItem.isSaving = false;
		}
	}

	// Do not regenerate list excessively
	public trackItems(index: number, item: T & IWrapper) { return item.id; }
}
