import { OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { tap } from "rxjs/operators";

export class BaseComponent implements OnInit
{
	public isBusy = false;
	public isError = false;

	constructor(protected http: Http) { }

	public ngOnInit()
	{
		this.reload();
	}

	protected get urlGet(): string { throw new Error("Not implemented."); }

	protected reload()
	{
		this.isError = false;
		const handle = setTimeout(() => this.isBusy = true, 500);

		return this.http.get(this.urlGet).pipe(
			tap(r =>
			{
				clearTimeout(handle);
				this.isBusy = false;
				this.isError = false;
				return r;
			}, err =>
				{
					clearTimeout(handle);
					this.isBusy = false;
					this.isError = true;
				})
		);
	}
}
