import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { map } from "rxjs/operators";
import { Config } from "../app.config";

@Component({
	selector: "ichen-login",
	template: `
		<form *ngIf="!isBusy" class="card">
			<div class="card-header badge-primary"><span class="glyphicon glyphicon-lock"></span>&nbsp;&nbsp;{{i18n.labelLogin}}</div>

			<div class="card-body">
				<div class="ichen-edit-id form-group" [class.has-danger]="!isValidUser || isError">
					<div class="input-group input-group-lg">
						<div class="input-group-prepend"><span class="input-group-text">{{i18n.labelUserName}}</span></div>
						<input name="input-username" [ngModel]="user" type="text" class="form-control form-control-danger" placeholder="{{i18n.labelEnterUserName}}"
							(input)="$event.target.value=user=$event.target.value.trim()"
						 />
					</div>
				</div>

				<div class="ichen-edit-id form-group" [class.has-danger]="!isValidPassword">
					<div class="input-group input-group-lg">
						<div class="input-group-prepend"><span class="input-group-text">{{i18n.labelPassword}}</span></div>
						<input name="input-password" [ngModel]="password" type="password" class="form-control form-control-danger" placeholder="{{i18n.labelEnterPassword}}"
							(input)="$event.target.value=password=$event.target.value.trim()"
						 />
					</div>
				</div>
			</div>

			<div class="card-footer buttons-strip">
				<button type="submit" [disabled]="!isValidUser || !isValidPassword" (click)="doLogin($event)" class="btn btn-primary"><span class="glyphicon glyphicon-log-in"></span>&nbsp;&nbsp;{{i18n.btnLogin}}</button>
			</div>
		</form>

		<div id="imgLoading" *ngIf="isBusy">
			<img src="images/common/loading.gif" />
		</div>
	`
})
export class LoginComponent
{
	public get i18n() { return Config.i18n; }

	public user: string | null = null;
	public password: string | null = null;
	public isBusy = false;
	public isError = false;

	constructor(private http: Http) { }

	public get isValidUser() { return !!this.user && !!this.user.trim(); }
	public get isValidPassword() { return !!this.password && !!this.password.trim(); }

	public doLogin(ev: Event)
	{
		ev.preventDefault();

		if (this.isBusy) return;
		if (!this.user) return;
		if (!this.password) return;

		const login = { name: this.user, password: this.password };

		this.isBusy = true;
		this.isError = false;

		this.http.post(Config.URL.login, JSON.stringify(login), {
			headers: new Headers({ "Content-Type": "application/json" })
		}).pipe(map(r => r.json() as ILoggedInUser))
			.subscribe(user =>
			{
				console.log("Successfully logged in.", user);
				this.isBusy = false;
				this.isError = false;

				if (!user.roles || user.roles.indexOf("All") < 0) {
					alert(this.i18n.textNoAuthority);
					this.isError = true;
					Config.currentUser = null;
				} else {
					Config.currentUser = user;
					Config.jumpToPage(Config.URL.homeRoute);
				}
			}, err =>
				{
					console.error(err);
					alert("Login failed.");

					Config.currentUser = null;
					this.isBusy = false;
					this.isError = true;
				});
	}
}
