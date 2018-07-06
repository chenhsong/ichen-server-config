import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Transform } from "../components/map-field-name.pipe";

@Component({
	selector: "ichen-terminal-display-box",
	template: `
		<terminal-controller class="ichen-terminal ichen-terminal-frame ctrl">
			<div class="ctrl-frame" (click)="selectLine(null)">
				<div class="frame-label">{{i18n.textClickForFrameStyles}}</div>
				<div *ngFor="let line of lines; let i=index"
				     class="ichen-terminal ichen-terminal-line ctrl-item {{line.class}} {{isSelected(line) ? 'selected' : ''}}"
				     (click)="selectLine(line);$event.stopPropagation();">

					<span class="ichen-terminal ichen-terminal-line ichen-terminal-line-field">{{transform(line.field)}}</span>

					<div class="ichen-terminal-line-marker-left glyphicon glyphicon-chevron-right" *ngIf="isSelected(line)"></div>
					<div class="ichen-terminal-line-marker-right" *ngIf="isSelected(line)"
						><span (click)="moveLine(i,-1)" class="glyphicon glyphicon-arrow-up" [class.disabled]="i<=0"></span
						><span (click)="moveLine(i,1)" class="glyphicon glyphicon-arrow-down" [class.disabled]="i>=lines.length-1"></span
					></div>
				</div>
				<div class="ctrl-item ctrl-item-separator"></div>
			</div>
		</terminal-controller>
	`
})
export class TerminalDisplayBoxComponent
{
	@Input() public readonly i18n!: ITranslationDictionary;

	@Input() public readonly lines!: Terminal.ILineConfig[];
	@Input() public selected: Terminal.ILineConfig | null = null;
	@Output("lineSelected") public readonly selectedEvent = new EventEmitter<Terminal.ILineConfig | null>();
	@Output("displayChanged") public readonly changeEvent = new EventEmitter<Terminal.ILineConfig[]>();

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
