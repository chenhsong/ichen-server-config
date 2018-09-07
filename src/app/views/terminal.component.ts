import { Component, Input, Output } from "@angular/core";
import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { Config } from "../app.config";
import { BaseComponent } from "./base.component";
import { StandardFields, CycleDataFields } from "../components/fields";
import { Transform } from "../components/map-field-name.pipe";
import NormalizeConfig from "../components/normalize";

@Component({
	selector: "ichen-terminal",
	templateUrl: "../templates/terminal.component.html"
})
export class TerminalComponent extends BaseComponent<Terminal.IConfig>
{
	public configFile!: Terminal.IConfig;
	public selectedLine: Terminal.ILineConfig | null = null;
	public frameSelected = false;
	public newEnabled = false;
	public isDirty = false;
	public isSaving = false;

	public readonly isDebug = Config.isDebug;
	public readonly transform = Transform;

	constructor(http: Http) { super(http); }

	protected buildLoadingPipeline()
	{
		return this.http.get(this.urlGet).pipe(
			// Get raw text
			map(r => r.text()),
			// Cut out everything before the first bracket - this is to handle JSON embedded as scripts
			map(text =>
			{
				const n = text.indexOf("{");
				return (n <= 0) ? text : text.substr(n);
			}),
			// Parse JSON into object
			map(text => JSON.parse(text) as Terminal.IConfig),
			// Normalize
			map(NormalizeConfig)
		);
	}

	protected async reloadAsync()
	{
		try {
			const config = await super.reloadAsync();

			console.log("Terminal configuration file loaded.", config);
			this.configFile = config;

			return config;
		} catch (err) {
			console.error("Cannot load terminal configuration file.", err);

			// Assume any error is failure to login
			Config.jumpToPage();

			return <any>null;
		}
	}

	protected get urlGet() { return Config.URL.terminalConfig; }
	protected get urlPost() { return Config.URL.terminalConfig; }

	public setDirty(dirty = true)
	{
		this.isDirty = dirty;

		// Create a new lines array to make sure the display box know of changes
		this.configFile.controllers.default.lines = this.configFile.controllers.default.lines.slice();
	}

	public selectLine(line: Terminal.ILineConfig | null)
	{
		this.newEnabled = false;

		if (!line) {
			// Select the frame
			this.frameSelected = true;
			this.selectedLine = null;
		} else {
			// Select the line
			this.frameSelected = false;
			this.selectedLine = line;
		}
	}

	public addNewLine(newline: { field: string; min?: string | number; max?: string | number; })
	{
		const line: Terminal.ILineConfig = { field: newline.field };
		if (newline.min !== null) line.min = newline.min;
		if (newline.max !== null) line.max = newline.max;

		// Put in filter
		for (const fld of StandardFields) {
			if (fld.name === newline.field) {
				line.filter = fld.filter;
				break;
			}
		}
		if (!line.filter) {
			for (const fld of CycleDataFields) {
				if (fld.name === newline.field) {
					line.filter = fld.filter;
					break;
				}
			}
		}

		this.configFile.controllers.default.lines.push(line);
		this.selectLine(line);
		this.newEnabled = false;
		this.setDirty();
	}

	public deleteLine(line: Terminal.ILineConfig | null)
	{
		if (!line) return;

		if (!confirm(this.i18n.labelConfirmDeleteLine.replace("{0}", this.transform(line.field)))) return;

		const n = this.configFile.controllers.default.lines.indexOf(line);
		if (n < 0) return;

		this.configFile.controllers.default.lines.splice(n, 1);

		this.frameSelected = false;
		this.selectedLine = null;
		this.setDirty();
	}

	public async saveConfigFileAsync()
	{
		if (!this.configFile) return;

		this.isSaving = true;

		try {
			await this.doPostAsync(this.urlPost, this.configFile);
			this.setDirty(false);
		} catch {
			this.isSaving = false;
			alert("Cannot save changes!");

			// Assume any error is failure to login
			Config.jumpToPage();
		} finally {
			this.isSaving = false;
		}
	}
}
