import { Component, Input, Output, EventEmitter } from "@angular/core";
import { findFieldDef } from "../components/fields";
import { Config } from "../app.config";
import * as Terminal from "../terminal-config"

@Component({
	selector: "ichen-terminal-value-maps-list",
	templateUrl: "../templates/terminal-value-maps-list.component.html"
})
export class TerminalValueMapsListComponent
{
	@Input() public readonly line!: Terminal.ILineConfig;
	@Input() public readonly title = "Value styles";
	@Input() public readonly textColors = true;
	@Input() public readonly backgroundColors = true;
	@Output("listChanged") public readonly changeEvent = new EventEmitter<Terminal.ILineConfig>();

	private editingItem: Terminal.IClassMap | null = null;
	public newEnabled = false;

	public readonly findField = findFieldDef;

	public get i18n() { return Config.i18n; }

	public isNotNegated(map: Terminal.IClassMap) { return map.hasOwnProperty("value"); }
	public isNegated(map: Terminal.IClassMap) { return map.hasOwnProperty("notValue"); }

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
		} else if (Array.isArray(this.line.maps)) {
			this.line.maps.push(map);
		} else {
			this.line.maps = [this.line.maps, map];
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
