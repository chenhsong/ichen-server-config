import { OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Rx";

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
		this.isBusy = true;
		this.isError = false;

		return this.http.get(this.urlGet)
			.do(r =>
			{
				this.isBusy = false;
				this.isError = false;
				return r;
			}, err =>
				{
					this.isBusy = false;
					this.isError = true;
				});
	}
}
