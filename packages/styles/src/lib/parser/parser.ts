import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import {
	Sx,
	Prop,
	Theme,
	Style,
	Config,
	sxSchema,
	propsSchema,
	configSchema,
	stylesSchema,
	themesSchema,
} from '../validation';

class Parser {
	private static STYLES_DIR = 'src/config:styles';

	private static PROPS_FILE = 'src/config:sx/props.yaml';

	private static CONFIG_FILE = 'src/config:sx/config.yaml';

	private static THEMES_FILE = 'src/config:sx/themes.yaml';

	public static parse(): Sx {
		const props = this.parseProps();
		const config = this.parseConfig();
		const styles = this.parseStyles();
		const themes = this.parseThemes();

		return sxSchema.validateSync({
			props,
			config,
			styles,
			themes,
		});
	}

	private static parseConfig(): NonNullable<Config> {
		const file = path.join(__dirname, '../../..', this.CONFIG_FILE);

		if (!fs.existsSync(file)) {
			throw new Error(`@monorepo/styles: config file not found at ${file}`);
		}

		const config = yaml.load(fs.readFileSync(file, 'utf8'));
		return configSchema.validateSync(config);
	}

	private static parseStyles(): NonNullable<Style>[] {
		const styles: NonNullable<Style>[] = [];

		const dir = path.join(__dirname, '../../..', this.STYLES_DIR);

		if (!fs.existsSync(dir)) {
			throw new Error(`@monorepo/styles: styles directory not found at ${dir}`);
		}

		const files = fs
			.readdirSync(dir)
			.filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'));

		for (let i = 0; i < files.length; i += 1) {
			const file = files[i];

			const content = yaml.load(fs.readFileSync(path.join(dir, file), 'utf8'));
			const parsed = stylesSchema.validateSync(content);

			styles.push(...parsed);
		}

		return styles;
	}

	private static parseThemes(): NonNullable<Theme>[] {
		const file = path.join(__dirname, '../../..', this.THEMES_FILE);

		if (!fs.existsSync(file)) {
			throw new Error(`@monorepo/styles: themes file not found at ${file}`);
		}

		const content = yaml.load(fs.readFileSync(file, 'utf8'));

		return themesSchema.validateSync(content);
	}

	private static parseProps(): NonNullable<Prop>[] {
		const file = path.join(__dirname, '../../..', this.PROPS_FILE);

		if (!fs.existsSync(file)) {
			throw new Error(`@monorepo/styles: props file not found at ${file}`);
		}

		const content = yaml.load(fs.readFileSync(file, 'utf8'));

		return propsSchema.validateSync(content);
	}
}

export default Parser;
