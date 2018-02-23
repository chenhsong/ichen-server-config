export const MiscColors = {
	NotSet: "unset",
	Blink: "blink",
	Regular: "text-regular",
	Bold: "text-bold",
	Italics: "text-italics"
};

export interface IColorDef
{
	name: string;
	description: string;
}

export const BackgroundColors: IColorDef[] = [
	{ name: MiscColors.NotSet, description: "labelBackgroundColorNotSet" },
	{ name: "color-transparent", description: "labelTransparent" },
	{ name: "color-black", description: "labelBackgroundColorBlack" },
	{ name: "color-gray", description: "labelBackgroundColorGray" },
	{ name: "color-red", description: "labelBackgroundColorRed" },
	{ name: "color-green", description: "labelBackgroundColorGreen" },
	{ name: "color-blue", description: "labelBackgroundColorBlue" },
	{ name: "color-orange", description: "labelBackgroundColorOrange" },
	{ name: "color-yellow", description: "labelBackgroundColorYellow" },
	{ name: "color-magenta", description: "labelBackgroundColorMagenta" },
	{ name: "color-brown", description: "labelBackgroundColorBrown" },
	{ name: "color-cyan", description: "labelBackgroundColorCyan" },
	{ name: "color-purple", description: "labelBackgroundColorPurple" },
	{ name: "color-white", description: "labelBackgroundColorWhite" }
];

export const TextColors: IColorDef[] = [
	{ name: MiscColors.NotSet, description: "labelTextColorNotSet" },
	{ name: "text-invisible", description: "labelInvisible" },
	{ name: "text-black", description: "labelTextColorBlack" },
	{ name: "text-gray", description: "labelTextColorGray" },
	{ name: "text-red", description: "labelTextColorRed" },
	{ name: "text-green", description: "labelTextColorGreen" },
	{ name: "text-blue", description: "labelTextColorBlue" },
	{ name: "text-orange", description: "labelTextColorOrange" },
	{ name: "text-yellow", description: "labelTextColorYellow" },
	{ name: "text-magenta", description: "labelTextColorMagenta" },
	{ name: "text-brown", description: "labelTextColorBrown" },
	{ name: "text-cyan", description: "labelTextColorCyan" },
	{ name: "text-purple", description: "labelTextColorPurple" },
	{ name: "text-white", description: "labelTextColorWhite" }
];

export const BorderColors: IColorDef[] = [
	{ name: MiscColors.NotSet, description: "labelNotSet" },
	{ name: "border-invisible", description: "labelNoBorder" },
	{ name: "border-black", description: "labelColorBlack" },
	{ name: "border-gray", description: "labelColorGray" },
	{ name: "border-red", description: "labelColorRed" },
	{ name: "border-green", description: "labelColorGreen" },
	{ name: "border-blue", description: "labelColorBlue" },
	{ name: "border-orange", description: "labelColorOrange" },
	{ name: "border-yellow", description: "labelColorYellow" },
	{ name: "border-magenta", description: "labelColorMagenta" },
	{ name: "border-brown", description: "labelColorBrown" },
	{ name: "border-cyan", description: "labelColorCyan" },
	{ name: "border-purple", description: "labelColorPurple" },
	{ name: "border-white", description: "labelColorWhite" }
];
