import { OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { map } from "rxjs/operators";
import { CoreComponent } from "./core.component";

export class BaseComponent<R extends object> extends CoreComponent implements OnInit
{
	constructor(http: Http) { super(http); }

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
