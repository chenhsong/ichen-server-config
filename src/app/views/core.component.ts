import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Config } from "../app.config";

export class CoreComponent
{
	private static readonly PostHeaders = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };

	public isBusy = false;
	public isError = false;

	public get i18n() { return Config.i18n; }

	constructor(protected http: HttpClient) { }

	protected async doGetJsonAsync<R extends object>(url: string)
	{
		return await this.http.get<R>(url).toPromise();
	}

	protected async doPostAsync(url: string, data: unknown)
	{
		return await this.http.post(url, JSON.stringify(data), CoreComponent.PostHeaders).toPromise();
	}

	protected async doPostJsonAsync<R extends object>(url: string, data: unknown)
	{
		return await this.http.post<R>(url, JSON.stringify(data), CoreComponent.PostHeaders).toPromise();
	}

	protected async doDeleteAsync(url: string)
	{
		return await this.http.delete(url).toPromise();
	}
}
