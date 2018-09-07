import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MiscColors, BackgroundColors, TextColors, BorderColors, IColorDef } from "../components/colors";

@Component({
	selector: "ichen-terminal-formatting",
	templateUrl: "../templates/terminal-formatting.component.html"
})
export class TerminalFormattingComponent
{
	@Input() public readonly i18n!: ITranslationDictionary;

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

	constructor()
	{
		let regexp = new RegExp(`\\btext-bold\\b`); this.hasBold = regexp.test.bind(regexp);
		regexp = new RegExp(`\\btext-italics\\b`); this.hasItalics = regexp.test.bind(regexp);
		regexp = new RegExp(`\\b${MiscColors.Blink}\\b`); this.hasBlink = regexp.test.bind(regexp);
	}

	public toggleClass(classname: string)
	{
		if (classname === MiscColors.NotSet) return;

		// NOTE - For Edge, we must first remove a class with an active animation before we can change
		//        a property that is being animated
		const remove_blink = (classname !== MiscColors.Blink && this.hasBlink(this.classes)) ? MiscColors.Blink : null;

		const cx = (this.classes || "").split(" ").filter(cls => !!cls && cls !== remove_blink);
		let newclasses: string | null;

		if (cx.some(cls => cls === classname)) {
			newclasses = cx.filter(cls => cls !== classname).join(" ").trim() || null;
		} else {
			newclasses = cx.concat(classname).join(" ").trim() || null;
		}

		this.changeEvent.emit(newclasses);

		if (remove_blink) {
			newclasses = newclasses ? `${newclasses} ${MiscColors.Blink}` : MiscColors.Blink;
			setTimeout(() => this.changeEvent.emit(newclasses), 0);
		}
	}

	public getColor(type: string)
	{
		if (!this.classes) return MiscColors.NotSet;

		let defns: IColorDef[];

		switch (type) {
			case "B": defns = BackgroundColors; break;
			case "T": defns = TextColors; break;
			case "R": defns = BorderColors; break;
			default: return MiscColors.NotSet;
		}

		const padded = ` ${this.classes} `;

		for (const color of defns) {
			const colorkey = ` ${color.name} `;
			if (padded.indexOf(colorkey) >= 0) return color.name;
		}

		return MiscColors.NotSet;
	}

	public setColor(type: string, color: string)
	{
		// NOTE - For Edge, we must first remove a class with an active animation before we can change
		//        a property that is being animated
		const remove_blink = this.hasBlink(this.classes) ? MiscColors.Blink : null;

		function setClasses(typeCode: string, classes: string, colorCode: string, doblink: string | null)
		{
			if (!colorCode) return classes;

			let defns: IColorDef[];

			switch (typeCode) {
				case "B": defns = BackgroundColors; break;
				case "T": defns = TextColors; break;
				case "R": defns = BorderColors; break;
				default: return classes;
			}

			let cx = (classes || "").split(" ");
			cx = cx.filter(c => !!c && c !== doblink).filter(c => !defns.some(cdef => cdef.name === c));
			if (colorCode !== MiscColors.NotSet) cx.push(colorCode);

			return cx.join(" ") || null;
		}

		let newclasses = setClasses(type, this.classes, color, remove_blink);
		this.changeEvent.emit(newclasses);

		if (remove_blink) {
			newclasses = newclasses ? `${newclasses} ${MiscColors.Blink}` : MiscColors.Blink;
			setTimeout(() => this.changeEvent.emit(newclasses), 0);
		}
	}
}
