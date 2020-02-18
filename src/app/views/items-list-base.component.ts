import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Config } from "../app.config";
import { Dictionary, Wrapped } from "../interfaces";
import { BaseComponent } from "./base.component";

export class ItemsListBaseComponent<T extends object> extends BaseComponent<Dictionary<T>>
{
	public filter = "";
	public newItem: Wrapped<T> | null = null;
	public editingItem: T | null = null;
	public readonly itemStream = new Subject<Wrapped<T>[]>();

	constructor(http: HttpClient) { super(http); }

	public filterChanged(text: string)
	{
		this.filter = (text ?? "").trim();

		// Disable editing if it hides the controller currently being edited
		if (this.editingItem && !this.isEditing(this.editingItem, true)) this.editingItem = null;
	}

	protected getNewItem(): Wrapped<T>
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

	protected editItem(item: Wrapped<T> | null)
	{
		if (this.isBusy) return;
		if (item?.isSaving) return;

		this.editingItem = item;
	}

	protected get itemKeyField(): string { throw new Error("Not implemented."); }

	protected sortList(list: Wrapped<T>[]) { return list; }

	public async reloadAsync()
	{
		this.editItem(null);
		this.itemStream.next([]);

		try {
			const items = await super.reloadAsync();
			const list: Wrapped<T>[] = [];

			for (const key in items) {
				if (!items.hasOwnProperty(key)) continue;
				const item = items[key] as Wrapped<T>;
				list.push(item);
			}

			this.itemStream.next(this.sortList(list));

			return items;
		} catch (err) {
			console.error("Cannot get list.", err);

			// Assume any error is failure to login
			Config.jumpToPage();

			return <any>null;
		}
	}

	public async onAddAsync(newItem: T)
	{
		this.editingItem = null;
		console.log("Adding new item", newItem);

		try {
			const resp = await this.doPostAsync(this.urlGet, newItem);

			console.log("Item successfully added.", resp);

			await this.reloadAsync();
		} catch (err) {
			console.error(err);
			alert("Cannot add item! " + err);

			// Assume any error is failure to login
			Config.jumpToPage();
		}
	}

	public async onSaveAsync(oldItem: Wrapped<T>, newItem: T)
	{
		this.editingItem = null;
		oldItem.isSaving = true;

		console.log("Saving changes", newItem);

		try {
			const item = await this.doPostJsonAsync<T>(`${this.urlGet}/${(oldItem as Dictionary<unknown>)[this.itemKeyField]}`, newItem);

			console.log("Changes successfully saved.", item);

			// Mixin the new item
			for (const key in item) {
				if (!item.hasOwnProperty(key)) continue;
				(oldItem as Dictionary<unknown>)[key] = (item as Dictionary<unknown>)[key];
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

	public async onDeleteAsync(oldItem: Wrapped<T>, item: T)
	{
		this.editingItem = null;
		oldItem.isSaving = true;

		console.log("Deleting item", item);

		try {
			await this.doDeleteAsync(`${this.urlGet}/${(oldItem as Dictionary<unknown>)[this.itemKeyField]}`);

			console.log("Item successfully deleted.", item);

			await this.reloadAsync();
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
	public trackItems(index: number, item: Wrapped<T>) { return item.id; }
}
