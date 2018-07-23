import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { appRoutingModule, appRoutingProviders } from "./app.routes";
import { LoginComponent } from "./views/login.component";
import { HomeComponent } from "./views/home.component";
import { UsersListComponent } from "./views/users-list.component";
import { ControllersListComponent } from "./views/controllers-list.component";
import { LogsComponent } from "./views/logs.component";

import { ListHeaderComponent } from "./views/list-header.component";
import { ControllerComponent } from "./views/controller.component";
import { ControllerEditorComponent } from "./views/controller-editor.component";
import { UserComponent } from "./views/user.component";
import { UserEditorComponent } from "./views/user-editor.component";

import { TerminalComponent } from "./views/terminal.component";
import { TerminalDisplayBoxComponent } from "./views/terminal-display-box.component";
import { TerminalValueMapsListComponent } from "./views/terminal-value-maps-list.component";
import { TerminalValueMapComponent } from "./views/terminal-value-map.component";
import { TerminalValueMapEditorComponent } from "./views/terminal-value-map-editor.component";
import { TerminalFormattingComponent } from "./views/terminal-formatting.component";
import { TerminalAddFieldComponent } from "./views/terminal-add-field.component";

import { IsNumericPipe } from "./components/is-numeric.pipe";
import { MapFieldNamePipe } from "./components/map-field-name.pipe";

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		appRoutingModule
	],

	schemas: [CUSTOM_ELEMENTS_SCHEMA],

	declarations: [
		// Root Components
		AppComponent,

		// Sections
		LoginComponent,
		HomeComponent,
		UsersListComponent,
		ControllersListComponent,
		TerminalComponent,
		LogsComponent,

		ListHeaderComponent,

		// Controllers
		ControllerComponent,
		ControllerEditorComponent,

		// Users
		UserComponent,
		UserEditorComponent,

		// Terminal
		TerminalDisplayBoxComponent,
		TerminalAddFieldComponent,
		TerminalFormattingComponent,
		TerminalValueMapsListComponent,
		TerminalValueMapComponent,
		TerminalValueMapEditorComponent,

		// Pipes
		IsNumericPipe,
		MapFieldNamePipe
	],

	providers: [...appRoutingProviders],

	bootstrap: [AppComponent]
})
export class AppModule
{
}
