import { OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { CoreComponent } from "./core.component";

export class BaseComponent<R extends object> extends CoreComponent implements OnInit
{
	constructor(http: HttpClient) { super(http); }

	public ngOnInit()
	{
		this.reloadAsync();
	}

	protected get urlGet(): string { throw new Error("Not implemented."); }

	protected buildLoadingPipeline()
	{
		return this.http.get<R>(this.urlGet);
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
