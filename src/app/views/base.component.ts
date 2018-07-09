import { OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { map } from "rxjs/operators";

export class BaseComponent<R extends object> implements OnInit
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
		return this.http.get(this.urlGet).pipe(map(r => r.json() as R));
	}

	protected async reloadAsync()
	{
		this.isError = false;
		const handle = setTimeout(() => this.isBusy = true, 500);

		try {
			return await this.buildLoadingPipeline().toPromise();
		} catch (err) {
			this.isError = true;
			throw err;
		} finally {
			clearTimeout(handle);
			this.isBusy = false;
		}
	}
}
