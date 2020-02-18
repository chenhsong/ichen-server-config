import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MiscColors, BackgroundColors, TextColors, BorderColors, IColorDef } from "../components/colors";
import { Config } from "../app.config";

@Component({
	selector: "ichen-terminal-formatting",
	templateUrl: "../templates/terminal-formatting.component.html"
})
export class TerminalFormattingComponent
{
	@Input() public readonly title: string | null = null;
	@Input() public readonly large = false;
	@Input() public readonly classes!: string;
	@Input() public readonly textColors = true;
	@Input() public readonly backgroundColors = true;
	@Output("classesChanged") public readonly changeEvent = new EventEmitter<string | null>();

	public readonly colorDefs = { BackgroundColors, TextColors };
	public readonly hasBold: (classes: string) => boolean;
	public readonly hasItalics: (classes: string) => boolean;
	public readonly hasBlink: (classes: string) => boolean;

	public get i18n() { return Config.i18n; }

	constructor()
	{
		let regexp = new RegExp(`\\btext-bold\\b`); this.hasBold = regexp.test.bind(regexp);
		regexp = new RegExp(`\\btext-italics\\b`); this.hasItalics = regexp.test.bind(regexp);
		regexp = new RegExp(`\\b${MiscColors.Blink}\\b`); this.hasBlink = regexp.test.bind(regexp);
	}

	public toggleClass(className: string)
	{
		if (className === MiscColors.NotSet) return;

		// NOTE - For Edge, we must first remove a class with an active animation before we can change
		//        a property that is being animated
		const remove_blink = (className !== MiscColors.Blink && this.hasBlink(this.classes)) ? MiscColors.Blink : null;

		const cx = this.classes.split(" ").filter(cls => !!cls).filter(cls => cls !== remove_blink);
		let new_classes: string | null;

		if (cx.some(cls => cls === className)) {
			new_classes = cx.filter(cls => cls !== className).join(" ").trim() || null;
		} else {
			new_classes = cx.concat(className).join(" ").trim() || null;
		}

		this.changeEvent.emit(new_classes);

		if (remove_blink) {
			new_classes = new_classes ? `${new_classes} ${MiscColors.Blink}` : MiscColors.Blink;
			setTimeout(() => this.changeEvent.emit(new_classes), 0);
		}
	}

	public getColor(type: string)
	{
		if (!this.classes) return MiscColors.NotSet;

		let definitions: IColorDef[];

		switch (type) {
			case "B": definitions = BackgroundColors; break;
			case "T": definitions = TextColors; break;
			case "R": definitions = BorderColors; break;
			default: return MiscColors.NotSet;
		}

		const padded = ` ${this.classes} `;

		for (const color of definitions) {
			const color_key = ` ${color.name} `;
			if (padded.indexOf(color_key) >= 0) return color.name;
		}

		return MiscColors.NotSet;
	}

	public setColor(type: string, color: string)
	{
		// NOTE - For Edge, we must first remove a class with an active animation before we can change
		//        a property that is being animated
		const remove_blink = this.hasBlink(this.classes) ? MiscColors.Blink : null;

		function setClasses(typeCode: string, classes: string, colorCode: string, doBlink: string | null)
		{
			if (!colorCode) return classes;

			let definitions: IColorDef[];

			switch (typeCode) {
				case "B": definitions = BackgroundColors; break;
				case "T": definitions = TextColors; break;
				case "R": definitions = BorderColors; break;
				default: return classes;
			}

			let cx = classes.split(" ");
			cx = cx.filter(cls => !!cls).filter(cls => cls !== doBlink).filter(cls => !definitions.some(cdef => cdef.name === cls));
			if (colorCode !== MiscColors.NotSet) cx.push(colorCode);

			return cx.join(" ").trim() || null;
		}

		let new_classes = setClasses(type, this.classes, color, remove_blink);
		this.changeEvent.emit(new_classes);

		if (remove_blink) {
			new_classes = new_classes ? `${new_classes} ${MiscColors.Blink}` : MiscColors.Blink;
			setTimeout(() => this.changeEvent.emit(new_classes), 0);
		}
	}
}
