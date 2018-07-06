import { OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";

export class BaseComponent implements OnInit
{
	public isBusy = false;
	public isError = false;

	constructor(protected http: Http) { }

	public ngOnInit()
	{
		this.reloadAsync();
	}

	protected get urlGet(): string { throw new Error("Not implemented."); }

	protected buildLoadingPipeline()
	{
		return this.http.get(this.urlGet) as Observable<any>;
	}

	protected async reloadAsync()
	{
		this.isError = false;
		const handle = setTimeout(() => this.isBusy = true, 500);

		try {
			return await this.buildLoadingPipeline().toPromise();
		} catch {
			this.isError = true;
			return null;
		} finally {
			clearTimeout(handle);
			this.isBusy = false;
		}
	}
}
