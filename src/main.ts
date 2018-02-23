import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import { Config } from "./app/app.config";

if (location.toString().indexOf("debug") >= 0) Config.isDebug = true;

platformBrowserDynamic().bootstrapModule(AppModule);
