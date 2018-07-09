import { Http, Headers } from "@angular/http";
import { Config } from "../app.config";

export class CoreComponent
{
	private static PostHeaders = new Headers({ "Content-Type": "application/json" });

	public isBusy = false;
	public isError = false;

	public get i18n() { return Config.i18n; }

	constructor(protected http: Http) { }

	protected async doGetJsonAsync<R extends object>(url: string)
	{
		const resp = await this.http.get(url).toPromise();

		return resp.json() as R;
	}

	protected async doPostAsync(url: string, data: any)
	{
		return await this.http.post(url,
			JSON.stringify(data),
			{ headers: CoreComponent.PostHeaders }
		).toPromise();
	}

	protected async doPostJsonAsync<R extends object>(url: string, data: any)
	{
		const resp = await this.http.post(url,
			JSON.stringify(data),
			{ headers: CoreComponent.PostHeaders }
		).toPromise();

		return resp.json() as R;
	}

	protected async doDeleteAsync(url: string)
	{
		return await this.http.delete(url).toPromise();
	}
}
