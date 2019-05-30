import { Component, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Config } from "../app.config";
import { CoreComponent } from "./core.component";

interface IStatus
{
	started?: Date;
	uptime: string;
	isRunning: boolean;
	version: string;
	environment: string;
	port?: number;
	openProtocol?: number;
	OPCUA?: number[];
	controllers?: Dictionary<string>;
	clients?: Dictionary<string>;
}

@Component({
	selector: "ichen-home",
	templateUrl: "../templates/home.component.html"
})
export class HomeComponent extends CoreComponent implements OnDestroy
{
	public status: IStatus | null = null;
	public clientsList: { key: string; description: string; }[] | null = null;
	public controllersList: { key: string; description: string; }[] | null = null;
	private refreshTask = 0;

	constructor(http: HttpClient)
	{
		super(http);
		this.refreshAsync();
	}

	public ngOnDestroy()
	{
		clearInterval(this.refreshTask);
	}

	public async doLogoutAsync()
	{
		if (this.isBusy) return;
		Config.currentUser = null;

		await this.doGetJsonAsync<{}>(Config.URL.logout);
		Config.jumpToPage();
	}

	private async refreshAsync()
	{
		if (this.isBusy) return;

		this.isBusy = true;

		try {
			const status = await this.doGetJsonAsync<IStatus>(Config.URL.status);

			if (!this.refreshTask) this.refreshTask = setInterval(this.refreshAsync.bind(this), 5000);

			if (status.started) status.started = new Date(status.started);
			this.status = status;

			if (status.clients) {
				this.clientsList = [];
				for (const key in status.clients) this.clientsList.push({ key, description: status.clients[key] });
			} else {
				this.clientsList = null;
			}

			if (status.controllers) {
				this.controllersList = [];
				for (const key in status.controllers) this.controllersList.push({ key, description: status.controllers[key] });
			} else {
				this.controllersList = null;
			}
		} catch (err) {
			// Assume any error is failure to login
			Config.jumpToPage();
		} finally {
			this.isBusy = false;
		}
	}
}
