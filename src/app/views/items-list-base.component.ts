import { Http, Headers } from "@angular/http";
import { Subject } from "rxjs/Rx";
import { BaseComponent } from "./base.component";
import { Config } from "../app.config";

export class ItemsListBaseComponent<T extends {}> extends BaseComponent
{
	private static PostHeaders = new Headers({ "Content-Type": "application/json" });

	public filter = "";
	public newItem: (T & IWrapper) | null = null;
	public editingItem: T | null = null;
	public readonly itemStream = new Subject<(T & IWrapper)[]>();
	public readonly itemChangeStream = new Subject<number>();

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

	public reload(): any
	{
		this.editItem(null);
		this.itemStream.next([]);

		super.reload()
			.map(r => r.json() as { [key: string]: T; })
			.subscribe(items =>
			{
				const list: (T & IWrapper)[] = [];

				for (const key in items) {
					if (!items.hasOwnProperty(key)) continue;
					const item = items[key] as T & IWrapper;
					list.push(item);
				}

				this.itemStream.next(this.sortList(list));
			}, err =>
				{
					console.error("Cannot get list.", err);

					// Assume any error is failure to login
					Config.jumpToPage();
				});

		return null;
	}

	public onAdd(newItem: T)
	{
		this.editingItem = null;
		console.log("Adding new item", newItem);

		this.http.post(this.urlGet, JSON.stringify(newItem), {
			headers: ItemsListBaseComponent.PostHeaders
		}).subscribe(item =>
		{
			console.log("Item successfully added.", item);
			this.reload();
		}, err =>
			{
				console.error(err);
				alert("Cannot add item! " + err);

				// Assume any error is failure to login
				Config.jumpToPage();
			});
	}

	public onSave(oldItem: T & IWrapper, newItem: T)
	{
		this.editingItem = null;
		oldItem.isSaving = true;

		console.log("Saving changes", newItem);

		this.http.post(`${this.urlGet}/${(oldItem as any)[this.itemKeyField]}`, JSON.stringify(newItem), {
			headers: ItemsListBaseComponent.PostHeaders
		}).map(r => r.json() as T)
			.subscribe(item =>
			{
				console.log("Changes successfully saved.", item);

				// Mixin the new item
				for (const key in item) {
					if (!item.hasOwnProperty(key)) continue;
					(oldItem as any)[key] = (item as any)[key];
				}

				oldItem.isSaving = false;
				this.itemChangeStream.next(oldItem.id);
			}, err =>
				{
					console.error(err);
					alert("Cannot save item! " + err);
					oldItem.isSaving = false;
					oldItem.isError = true;
					this.itemChangeStream.next(oldItem.id);

					// Assume any error is failure to login
					Config.jumpToPage();
				});
	}

	public onDelete(oldItem: T & IWrapper, item: T)
	{
		this.editingItem = null;
		oldItem.isSaving = true;

		console.log("Deleting item", item);

		this.http.delete(`${this.urlGet}/${(oldItem as any)[this.itemKeyField]}`)
			.subscribe(r =>
			{
				console.log("Item successfully deleted.", item);
				oldItem.isSaving = false;
				this.reload();
			}, err =>
				{
					console.error(err);
					alert("Cannot delete item! " + err);
					oldItem.isSaving = false;
					oldItem.isError = true;
					this.itemChangeStream.next(oldItem.id);

					// Assume any error is failure to login
					Config.jumpToPage();
				});
	}

	// Do not regenerate list excessively
	public trackItems(index: number, item: T & IWrapper) { return item.id; }
}
