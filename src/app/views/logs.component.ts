import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { Config } from "../app.config";
import { NullField } from "../components/fields";
import { CoreComponent } from "./core.component";

interface ILogLine
{
	time: Date;
	level: string;
	class: string;
	thread: string;
	message: string;
}

@Component({
	selector: "ichen-logs",
	template: `
		<div *ngIf="!isError" class="row">
			<div class="form-group col-md-6 col-lg-5">
				<div class="input-group">
					<div class="input-group-prepend"><span class="input-group-text">{{i18n.labelDate}}</span></div>

					<select value="null" [disabled]="isBusy" (change)="onDateChangedAsync($event.target.value)" class="form-control custom-select">
						<option value="null">{{i18n.labelSelectDate}}</option>
						<option *ngFor="let date of datesList" value="{{date}}">{{date}}</option>
					</select>
				</div>
			</div>

			<div *ngIf="selectedDate && classesList" class="form-group col-md-5 col-lg-5">
				<div class="input-group">
					<div class="input-group-prepend"><span class="input-group-text">{{i18n.labelType}}</span></div>

					<select
						[ngModel]="selectedLevel"
						[disabled]="isBusy"
						(change)="selectedLevel=$event.target.value; lines=null;"
						class="form-control custom-select">

						<option value="null">{{i18n.labelAll}}</option>
						<option value="INFO">{{i18n.labelLogInfo}}</option>
						<option value="WARNING">{{i18n.labelLogWarn}}</option>
						<option value="ERROR">{{i18n.labelLogError}}</option>
						<option value="DEBUG">{{i18n.labelLogDebug}}</option>
					</select>
				</div>
			</div>
		</div>
		<div *ngIf="!isError" class="row">
			<div *ngIf="classesList" class="form-group col-md-9 col-lg-8">
				<div class="input-group">
					<div class="input-group-prepend"><span class="input-group-text">{{i18n.labelCategory}}</span></div>

					<select
						[ngModel]="selectedClass"
						[disabled]="isBusy"
						(change)="selectedClass=$event.target.value; lines=null;"
						class="form-control custom-select">

						<option value="null">{{i18n.labelAll}}</option>
						<option *ngFor="let cls of classesList" value="{{cls}}">{{cls}}</option>
					</select>
				</div>
			</div>
		</div>
		<div *ngIf="!isError" class="row">
			<div *ngIf="classesList" class="form-group col-sm-8">
				<div class="input-group">
					<div class="input-group-prepend"><span class="input-group-text">{{i18n.labelFormat}}</span></div>
					<select class="form-control"
						[ngModel]="format"
						(change)="format=$event.target.value; lines=null;">

						<option value="screen">{{i18n.labelFormatOnScreen}}</option>
						<option value="xls">{{i18n.labelFormatXls}}</option>
						<option value="xlsx">{{i18n.labelFormatXlsx}}</option>
						<option value="csv">{{i18n.labelFormatCsv}}</option>
						<option value="tsv">{{i18n.labelFormatTsv}}</option>
						<option value="json">{{i18n.labelFormatJson}}</option>
					</select>
				</div>
			</div>

			<div class="form-group col-sm-4">
				<button *ngIf="selectedDate && classesList"
					class="btn btn-primary text-center text-sm-left"
					[disabled]="isBusy"
					(click)="loadLogAsync()"
				><span class="glyphicon glyphicon-download-alt"></span>&nbsp;&nbsp;{{i18n.btnGo}}</button>
			</div>
		</div>

		<h4 *ngIf="lines">
			<span *ngIf="lines.length" class="badge badge-success">{{i18n.textLogRows}}: {{lines.length}}</span>
			<span *ngIf="!lines.length" class="badge badge-danger">{{i18n.textNoLogs}}</span>
		</h4>

		<h4 *ngIf="selectedDate && !isBusy && !isError && !lines"><em>{{i18n.textPressGoToLoadLogs}}</em></h4>

		<div id="imgLoading" *ngIf="isBusy">
			<img src="images/common/loading.gif" />
		</div>

		<div id="imgError" *ngIf="isError">
			<p><img src="images/common/stopsign.png" width="128" /></p>
			<h2>{{i18n.textNoAuthorityForLogs}}</h2>
		</div>

		<div *ngIf="lines && lines.length" class="table-responsive">
			<table class="table table-striped table-bordered table-sm">
				<thead>
					<tr>
						<th>{{i18n.labelTime}}</th>
						<th *ngIf="selectedLevel=='null'">{{i18n.labelType}}</th>
						<th *ngIf="selectedClass=='null'">{{i18n.labelCategory}}</th>
						<th>{{i18n.labelMessage}}</th>
					</tr>
				</thead>
				<tr *ngFor="let line of lines" [ngClass]="{'error':line.level=='ERROR', 'warning':line.level=='WARN'}">
					<td>{{line.time|date:'HH:mm:ss'}}</td>
					<td *ngIf="selectedLevel=='null'" [ngSwitch]="line.level" style="white-space:nowrap">
						<span *ngSwitchCase="'INFO'">{{i18n.labelLogInfo}}</span>
						<span *ngSwitchCase="'WARNING'">{{i18n.labelLogWarn}}</span>
						<span *ngSwitchCase="'ERROR'">{{i18n.labelLogError}}</span>
						<span *ngSwitchCase="'DEBUG'">{{i18n.labelLogDebug}}</span>
						<span *ngSwitchDefault>{{line.level}}</span>
					</td>
					<td *ngIf="selectedClass=='null'">{{line.class}}</td>
					<td>{{line.message}}</td>
				</tr>
			</table>
		</div>
	`
})
export class LogsComponent extends CoreComponent implements OnInit
{
	public datesList: string[] | null = null;
	public classesList: string[] | null = null;
	public selectedDate: string | null = null;
	public selectedLevel = NullField.name;
	public selectedClass = NullField.name;
	public lines: ILogLine[] | null = null;
	public format = "screen";

	constructor(http: Http) { super(http); }

	public async ngOnInit()
	{
		const handle = setTimeout(() => this.isBusy = true, 500);
		this.isError = false;

		try {
			this.datesList = await this.doGetJsonAsync<string[]>(Config.URL.logsList);
			this.isError = false;
		} catch (err) {
			console.error(err);
			this.isError = true;

			// Assume any error is failure to login
			//Config.jumpToPage();
		} finally {
			clearTimeout(handle);
			this.isBusy = false;
		}
	}

	public async onDateChangedAsync(date: string)
	{
		if (date === NullField.name) {
			this.selectedDate = null;
			this.selectedLevel = this.selectedClass = NullField.name;
			return;
		}

		this.selectedDate = date;
		const handle = setTimeout(() => this.isBusy = true, 500);
		this.isError = false;

		try {
			const info = await this.doGetJsonAsync<{ classes?: string[]; }>(`${Config.URL.logFile}/${this.selectedDate}/info`);

			const classes: string[] = info.classes || [];

			this.classesList = classes;
			this.selectedLevel = NullField.name;
			this.selectedClass = classes.some(cls => cls === "Core") ? "Core" : NullField.name;
			this.lines = null;
			this.isError = false;
		} catch (err) {
			this.classesList = null;
			console.error(err);
			this.isError = false;
		} finally {
			clearTimeout(handle);
			this.isBusy = false;
		}
	}

	public async loadLogAsync()
	{
		let url = `${Config.URL.logFile}/${this.selectedDate}`;
		const query: string[] = [];
		if (this.selectedLevel !== NullField.name) query.push("level=" + this.selectedLevel);
		if (this.selectedClass !== NullField.name) query.push("class=" + this.selectedClass);

		if (this.format === "screen") {
			// On-screen display

			if (query.length) url += "?" + query.join("&");
			const handle = setTimeout(() => this.isBusy = true, 500);
			this.isError = false;

			try {
				this.lines = await this.doGetJsonAsync<ILogLine[]>(url);
				this.lines.forEach(x => x.time = new Date(x.time));
				this.isError = false;
			} catch (err) {
				this.lines = null;
				console.error(err);
				this.isError = true;
			} finally {
				clearTimeout(handle);
				this.isBusy = false;
			}
		} else {
			// Download file
			query.push("format=" + this.format);
			if (query.length) url += "?" + query.join("&");

			//this.isBusy = true;

			if (Config.downloadIFrame) {
				Config.downloadIFrame.src = url;
				const msg = this.i18n.textDownloading;
				setTimeout(() => { alert(msg); }, 0);
			}
		}
	}
}
