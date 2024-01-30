export type CSSType = 'string' | 'raw' | 'pixel';

export type Style = {
	name: string;
	type: CSSType[];
	value: Record<string, string[]>;
	variable: {
		base: string;
		sub?: string[];
	};
};

export type ThemeDefault =
	| 'bg'
	| 'color'
	| 'font-size'
	| 'font-family'
	| 'font-weight';

export type Theme = {
	defaults: Required<Record<ThemeDefault, string>>;
	variables: Record<string, Record<string, string | string[]>>;
	breakpoints: Record<string, string>;
};

export type Prop = {
	prop: string;
	style: string;
	output: {
		raw: string;
		configured: string;
	};
};

export type Config = {
	props: Prop[];
};

export type StyleX = {
	config: Config;
	themes: Record<string, Theme>;
	styles: Record<string, Style[]>;
};
