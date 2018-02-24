import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/filter";
import { Config } from "../app.config";
import { findFieldDef, DefaultField } from "../components/fields";

@Component({
	selector: "ichen-terminal-value-maps-list",
	template: `
		<div class="card">
			<div class="card-header badge-primary">{{title}}</div>
			<div class="card-body ichen-terminal-value-map ichen-list-container">
				<div *ngFor="let map of line?.maps">
					<ichen-terminal-value-map [i18n]="i18n"
						class="ichen-terminal-value-map ichen-list-item"
						[info]="map"
						[defaultField]="line?.field"
						[defaultClasses]="line?.class"
						[textColors]="textColors"
						[backgroundColors]="backgroundColors"
						[changeStream]="itemChangeStream"
						*ngIf="isEditing(map,false)"
						(edit)="editItem(map)">
					</ichen-terminal-value-map>

					<ichen-terminal-value-map-editor [i18n]="i18n"
						class="ichen-terminal-value-map ichen-edit ichen-list-item"
						[title]="i18n.labelEditValueMap"
						[info]="map"
						[isAdd]="false"
						[fieldType]="findField(map.field || line?.field)"
						[negated]="isNegated(map)"
						[textColors]="textColors"
						[backgroundColors]="backgroundColors"
						*ngIf="isEditing(map,true)"
						(valueMapChanged)="changeEvent.emit(line)"
						(delete)="onDelete($event)"
						(close)="editItem(null)">
					</ichen-terminal-value-map-editor>
				</div>

				<!-- New value map dialog -->
				<ichen-terminal-add-field *ngIf="newEnabled" [i18n]="i18n"
					[title]="i18n.labelAddNewValueMap"
					[useDefault]="line?.field"
					(add)="onAdd($event)"
					(close)="newEnabled=false">
				</ichen-terminal-add-field>

				<!-- New value map button -->
				<button type="button" *ngIf="!newEnabled" (click)="newEnabled=true" class="btn btn-sm btn-success"><span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;{{i18n.btnNewValueMap}}</button>
			</div>
		</div>
	`
})
export class TerminalValueMapsListComponent implements OnInit
{
	@Input() public readonly i18n!: ITranslationDictionary;

	@Input() public readonly line!: Terminal.ILineConfig;
	@Input() public readonly title = "Value styles";
	@Input() public readonly textColors = true;
	@Input() public readonly backgroundColors = true;
	@Input() public readonly changeStream!: Observable<Terminal.ILineConfig>;
	@Output("listChanged") public readonly changeEvent = new EventEmitter<Terminal.ILineConfig>();

	private editingItem: Terminal.IClassMap | null = null;
	public newEnabled = false;
	public readonly itemChangeStream = new Subject<Terminal.IClassMap | null>();

	public readonly findField = findFieldDef;

	public isNotNegated(map: Terminal.IClassMap) { return map.hasOwnProperty("value"); }
	public isNegated(map: Terminal.IClassMap) { return map.hasOwnProperty("notValue"); }

	public ngOnInit()
	{
		this.changeStream.filter(x => !x || x === this.line).subscribe(() => this.itemChangeStream.next(null));
	}

	public isEditing(item: Terminal.IClassMap, editor: boolean)
	{
		if (!item) return false;
		if ((item === this.editingItem) !== editor) return false;
		return true;
	}

	public editItem(item: Terminal.IClassMap)
	{
		this.newEnabled = false;
		this.editingItem = item;
	}

	public onAdd(newline: { field: string; min?: string | number; max?: string | number; })
	{
		const map: Terminal.IClassMapValueBase = { class: null, value: null };
		if (newline.field) map.field = newline.field;

		if (!this.line.maps) {
			this.line.maps = [map];
		} else {
			if (Array.isArray(this.line.maps)) {
				this.line.maps.push(map);
			} else {
				this.line.maps = [this.line.maps, map];
			}
		}

		this.changeEvent.emit(this.line);
		this.newEnabled = false;
	}

	public onDelete(item: Terminal.IClassMap)
	{
		if (!this.line.maps) return;
		if (!confirm(this.i18n.textConfirmDeleteValueMap)) return;

		// Delete the value map entry

		if (Array.isArray(this.line.maps)) {
			this.line.maps = this.line.maps.filter(map => map !== item);
		} else {
			if (this.line.maps === item) delete this.line.maps;
		}

		this.changeEvent.emit(this.line);
		this.newEnabled = false;
	}
}
