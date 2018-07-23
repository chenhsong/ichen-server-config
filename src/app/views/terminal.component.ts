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
	template: `
		<div class="ichen-terminal row" *ngIf="configFile">
			<div class="col-11 col-md-5 col-lg-4">
				<!-- Display Box -->
				<ichen-terminal-display-box [i18n]="i18n"
					[lines]="configFile?.controllers?.default?.lines"
					[selected]="selectedLine"
					(lineSelected)="selectLine($event)"
					(displayChanged)="setDirty()"
					[class.frame-selected]="frameSelected">
				</ichen-terminal-display-box>

				<div>&nbsp;</div>

				<!-- New line dialog -->
				<ichen-terminal-add-field *ngIf="newEnabled" [i18n]="i18n"
					[title]="i18n.labelAddNewLine"
					[useMinMax]="true"
					(add)="addNewLine($event)"
					(close)="newEnabled=false">
				</ichen-terminal-add-field>

				<!-- New line/Delete line buttons -->
				<div *ngIf="!newEnabled && !frameSelected" class="col p-x-0 buttons-strip" style="width:140%;margin:0 -20%;">
					<button type="button" (click)="newEnabled=true; selectedLine=null" class="btn btn-sm btn-success"><span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;{{i18n.btnNew}}</button>
					&nbsp;&nbsp;&nbsp;
					<button type="button" *ngIf="!!selectedLine" (click)="deleteLine(selectedLine)" class="btn btn-sm btn-danger"><span class="glyphicon glyphicon-trash"></span>&nbsp;&nbsp;{{i18n.btnDeleteLine}}</button>
				</div>

				<!-- Save button -->
				<div class="col p-x-0 buttons-strip">
					<br />
					<button type="button" (click)="saveConfigFile()" [disabled]="!isDirty||isSaving" class="btn btn-success"><span *ngIf="!isSaving" class="glyphicon glyphicon-floppy-disk"><img *ngIf="isSaving" width="18" src="images/common/loading.gif" /></span>&nbsp;&nbsp;{{i18n.btnSaveChanges}}</button>
					<br />
				</div>

				<div>&nbsp;</div>
			</div>

			<div class="clearfix d-md-none"></div>

			<div class="col-md-7 col-lg-8">
				<div [hidden]="!frameSelected">
					<!-- Value maps -->
					<ichen-terminal-value-maps-list [i18n]="i18n"
						[line]="configFile?.controllers?.default"
						[title]="i18n.labelFrameStyles"
						[textColors]="false"
						(listChanged)="setDirty()">
					</ichen-terminal-value-maps-list>
					<div *ngIf="isDebug">{{configFile?.controllers?.default?.maps|json}}</div>
				</div>

				<!-- Line formatting -->
				<div [hidden]="!selectedLine" class="ichen-terminal-line-format">
					<!-- Basic formatting -->
					<div class="card ichen-terminal-line-format-base">
						<div class="card-header badge-primary">{{transform(selectedLine?.field)}}</div>
						<div class="card-body">
							<div class="row">
								<div class="ichen-edit-formatting form-group col">
									<ichen-terminal-formatting [i18n]="i18n" [classes]="selectedLine?.class" (classesChanged)="selectedLine.class=$event; setDirty()"></ichen-terminal-formatting>
								</div>
							</div>

							<div *ngIf="selectedLine?.min!=null||selectedLine?.max!=null">
								<div class="row">
									<div *ngIf="selectedLine?.min!=null" class="form-group col-sm-6">
										<div class="input-group input-group-sm">
											<div class="input-group-prepend"><span class="input-group-text">{{i18n.labelMin}}</span></div>
											<div class="form-control"><span>{{transform(selectedLine?.min?.toString())}}</span></div>
										</div>
									</div>
									<div *ngIf="selectedLine?.max!=null" class="form-group col-sm-6">
										<div class="input-group input-group-sm">
											<div class="input-group-prepend"><span class="input-group-text">{{i18n.labelMax}}</span></div>
											<div class="form-control"><span>{{transform(selectedLine?.max?.toString())}}</span></div>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="form-group col">
										<ichen-terminal-formatting [i18n]="i18n"
											[title]="i18n.labelOverlayBarColor"
											[textColors]="false"
											[classes]="selectedLine?.overlay"
											(classesChanged)="selectedLine.overlay=$event; setDirty()">
										</ichen-terminal-formatting>
									</div>
								</div>
							</div>

							<div class="row">
								<div class="ichen-edit-alwaysShow form-group col-5">
									<div class="input-group input-group-sm">
										<div class="form-control justify-content-center"><input name="input-show-always" type="checkbox" [ngModel]="selectedLine?.showAlways" (change)="selectedLine.showAlways=$event.target.checked; setDirty()" /></div>
										<div class="input-group-append"><span class="input-group-text" [class.badge-success]="selectedLine?.showAlways">{{i18n.labelShowAlways}}</span></div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Value maps -->
					<ichen-terminal-value-maps-list [i18n]="i18n"
						[line]="selectedLine"
						[title]="i18n.labelValueStyles"
						(listChanged)="setDirty()">
					</ichen-terminal-value-maps-list>

					<div *ngIf="isDebug">{{selectedLine|json}}</div>
				</div>
			</div>
		</div>

		<div id="imgLoading" *ngIf="isBusy" class="text-center">
			<img src="images/common/loading.gif" />
		</div>

		<div id="imgError" *ngIf="isError"><img src="images/common/error.png" /></div>
	`
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
