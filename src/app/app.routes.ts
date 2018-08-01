import { ModuleWithProviders, Provider } from "@angular/core";
import { RouterModule, Route } from "@angular/router";

import { LoginComponent } from "./views/login.component";
import { HomeComponent } from "./views/home.component";
import { UsersListComponent } from "./views/users-list.component";
import { ControllersListComponent } from "./views/controllers-list.component";
import { TerminalComponent } from "./views/terminal.component";
import { LogsComponent } from "./views/logs.component";

export interface IRoute extends Route
{
	name?: string;
	icon?: string;
	hidden?: boolean;
}

export const appRoutes: IRoute[] = [
	{ path: "login", name: "routeLogin", component: LoginComponent, hidden: true },
	{ path: "home", name: "routeHome", component: HomeComponent, icon: "home" },
	{ path: "users", name: "routeUsers", icon: "user", component: UsersListComponent },
	{ path: "machines", name: "routeMachines", icon: "hdd", component: ControllersListComponent },
	{ path: "terminal", name: "routeTerminalLayout", icon: "blackboard", component: TerminalComponent },
	{ path: "logs", name: "routeLogs", icon: "list", component: LogsComponent },
	{ path: "**", redirectTo: "/home", hidden: true }
];

export const appRoutingProviders: Provider[] = [];

export const appRoutingModule = RouterModule.forRoot(appRoutes);
