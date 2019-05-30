import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
	templateUrl: "../templates/logs.component.html"
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

	constructor(http: HttpClient) { super(http); }

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
