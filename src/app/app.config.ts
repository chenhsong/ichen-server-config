import { ApplicationRef } from "@angular/core";
import { ITranslationDictionary, ILoggedInUser } from "./interfaces";

// Constants

const urlRoot = (window as any).ServiceUrl || "";
let defaultLang = "en";
const langKey = "lang";
const downloadIFrameID = "downloadIFrame";

const URL = {
	i18n: "lib/i18n.json",
	loginRoute: "routeLogin",
	homeRoute: "routeHome",
	login: `${urlRoot}/login`,
	logout: `${urlRoot}/logout`,
	users: `${urlRoot}/config/users`,
	controllers: `${urlRoot}/config/controllers`,
	terminalConfig: `${urlRoot}/config/terminal`,
	logsList: `${urlRoot}/logs/list`,
	logFile: `${urlRoot}/logs`,
	status: `${urlRoot}/status`
};

// Read language from local storage

if (localStorage) {
	const lang = localStorage.getItem(langKey);
	if (!!lang) defaultLang = lang;
}

// Utility functions

function jumpToPage(page?: string) { throw new Error("Not implemented."); }

let i18n: { [lang: string]: ITranslationDictionary; } | null = null;

export function switchLanguage(lang: string)
{
	if (!i18n) {
		// Dictionary not yet loaded
		Config.lang = "NOTLOADED";
		Config.i18n = {};
		return;
	}

	// Default for unknown language
	if (!(lang in i18n)) lang = defaultLang;

	// Set new language
	Config.lang = lang;
	Config.i18n = i18n[lang];

	// Store in local storage
	if (localStorage) localStorage.setItem(langKey, lang);

	console.log(`Language switched to [${lang}]`);
}

export const Config = {
	urlRoot,
	URL,
	isDebug: false,
	appRef: null as (ApplicationRef | null),
	jumpToPage,
	currentUser: null as (ILoggedInUser | null),
	lang: "NOTLOADED",
	i18n: {} as ITranslationDictionary,
	get downloadIFrame() { return document.getElementById(downloadIFrameID) as HTMLIFrameElement; }
};

// Load dictionary

(async function()
{
	const resp = await fetch(URL.i18n);
	i18n = (await resp.json());
	console.debug("Translation file loaded:", i18n);

	switchLanguage(Config.lang);

	// Manually trigger change detection since the fetch API works outside of Angular's zone
	if (Config.appRef) Config.appRef.tick();
})();
