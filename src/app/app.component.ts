import { Component, Input, Output, enableProdMode, ApplicationRef } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { Config, switchLanguage } from "./app.config";
import { appRoutes } from "./app.routes";

enableProdMode();

if (location.toString().indexOf("debug") >= 0) Config.isDebug = true;

@Component({
	selector: "ichen-server-config",
	template: `
		<header>
			<div class="container">
				<a href="/"><img id="logo-ichen" src="images/common/ichen_40_logo_small.png" /></a>
				<a id="logo-ch" href="https://chenhsong.com"><img src="images/common/header_logo_dark.png" /><img class="d-none d-sm-inline" src="images/common/{{i18n.ch_logo}}.png" /></a>
				<span class="d-none d-md-inline">{{i18n.app_title_full}}<span *ngIf="isDebug"> (Debug Mode)</span></span>
				<span class="d-md-none">{{i18n.app_title_short}}</span>
			</div>
		</header>

		<div class="container">
			<div id="languages" class="float-right">
				<a [class.active]="currentLang=='en'" (click)="switchLanguage('en')"><img src="images/common/lang_en.png" /></a>
				<a [class.active]="currentLang=='zh-tw'" (click)="switchLanguage('zh-tw')"><img src="images/common/lang_zh-tw.png" /></a>
				<a [class.active]="currentLang=='zh-cn'" (click)="switchLanguage('zh-cn')"><img src="images/common/lang_zh-cn.png" /></a>
			</div>
		</div>

		<div class="clearfix"></div>

		<div class="container">
			<div class="ichen-nav-shrink d-lg-none">
				<div class="btn-group">
					<a *ngFor="let link of routes" routerLink="/{{link.path}}" [ngClass]="isRouteActive(link.path) ? 'btn-primary active' : 'btn-secondary'" class="btn btn-lg" title="{{i18n[link.name]}}">
						<span class="glyphicon glyphicon-{{link.icon}}"></span>
					</a>
				</div>
			</div>
		</div>

		<div class="clearfix"></div>

		<div class="container">
			<div class="row">
				<div class="ichen-nav d-none d-lg-block col-lg-3">
					<div class="btn-group-vertical">
						<a *ngFor="let link of routes" routerLink="/{{link.path}}" [ngClass]="isRouteActive(link.path) ? 'btn-primary active' : 'btn-secondary'" class="btn btn-lg">
							<span class="glyphicon glyphicon-{{link.icon}}"></span>&nbsp;&nbsp;{{i18n[link.name]}}
						</a>
					</div>
				</div>

				<div class="ichen-content col-lg-9">
					<router-outlet></router-outlet>
				</div>
			</div>
		</div>

		<iframe id="downloadIFrame" class="d-none"></iframe>
	`
})
export class AppComponent
{
	public readonly isDebug = Config.isDebug;
	public get i18n() { return Config.i18n; }
	public get currentLang() { return Config.lang; }
	public readonly routes = appRoutes.filter(r => !r.hidden);
	public readonly switchLanguage = switchLanguage;

	private jumpToPage(page = Config.URL.loginRoute)
	{
		return this.router.navigate(appRoutes.filter(r => r.name === page).map(r => "/" + r.path));
	}

	constructor(private location: Location, private router: Router, private app: ApplicationRef)
	{
		Config.jumpToPage = this.jumpToPage.bind(this);
		Config.appRef = app;
	}

	public isRouteActive(path: string)
	{
		const loc = this.location.path();
		const n = loc.lastIndexOf(path);
		return (n >= 0) && (path.length + n >= loc.length);
	}
}
