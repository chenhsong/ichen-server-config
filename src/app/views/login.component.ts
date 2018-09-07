import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import { Config } from "../app.config";
import { CoreComponent } from "./core.component";

@Component({
	selector: "ichen-login",
	templateUrl: "../templates/login.component.html"
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
