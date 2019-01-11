import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Transform } from "../components/map-field-name.pipe";
import { Config } from "../app.config";

@Component({
	selector: "ichen-terminal-display-box",
	templateUrl: "../templates/terminal-display-box.component.html"
})
export class TerminalDisplayBoxComponent
{
	@Input() public readonly lines!: Terminal.ILineConfig[];
	@Input() public selected: Terminal.ILineConfig | null = null;
	@Output("lineSelected") public readonly selectedEvent = new EventEmitter<Terminal.ILineConfig | null>();
	@Output("displayChanged") public readonly changeEvent = new EventEmitter<Terminal.ILineConfig[]>();

	public get i18n() { return Config.i18n; }

	public readonly transform = Transform;

	public selectLine(line: Terminal.ILineConfig | null)
	{
		this.selected = line;
		this.selectedEvent.emit(line);
	}

	public isSelected(line: Terminal.ILineConfig) { return line === this.selected; }

	public moveLine(index: number, delta: number)
	{
		const swap = index + delta;
		if (swap < 0) return;
		if (swap >= this.lines.length) return;

		const tmp = this.lines[index];
		this.lines[index] = this.lines[swap];
		this.lines[swap] = tmp;

		this.changeEvent.emit(this.lines);
	}
}
