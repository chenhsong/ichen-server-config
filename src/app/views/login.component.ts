import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import { Config } from "../app.config";
import { CoreComponent } from "./core.component";

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
				<button type="submit" [disabled]="!isValidUser || !isValidPassword" (click)="doLoginAsync($event)" class="btn btn-primary"><span class="glyphicon glyphicon-log-in"></span>&nbsp;&nbsp;{{i18n.btnLogin}}</button>
			</div>
		</form>

		<div id="imgLoading" *ngIf="isBusy">
			<img src="images/common/loading.gif" />
		</div>
	`
})
export class LoginComponent extends CoreComponent
{
	public user: string | null = null;
	public password: string | null = null;

	constructor(http: Http) { super(http); }

	public get isValidUser() { return !!this.user && !!this.user.trim(); }
	public get isValidPassword() { return !!this.password && !!this.password.trim(); }

	public async doLoginAsync(ev: Event)
	{
		ev.preventDefault();

		if (this.isBusy) return;
		if (!this.user) return;
		if (!this.password) return;

		this.isBusy = true;
		this.isError = false;

		try {
			const user = await this.doPostJsonAsync<ILoggedInUser>(Config.URL.login, {
				name: this.user,
				password: this.password
			});

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
		} catch (err) {
			console.error(err);
			alert("Login failed.");

			Config.currentUser = null;
			this.isBusy = false;
			this.isError = true;
		}
	}
}
