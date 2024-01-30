import fs from 'fs';
import Generative from './generative';
import { Style, Sx } from '../validation';

class ThemeGenerator implements Generative {
	private sx: Sx;

	private GENERATED_THEMES_FILE = 'src/generated:scss/themes.scss';

	constructor(sx: Sx) {
		this.sx = sx;
	}

	public generate(): void {
		if (fs.existsSync(this.GENERATED_THEMES_FILE)) {
			fs.unlinkSync(this.GENERATED_THEMES_FILE);
		}

		const file = fs.createWriteStream(this.GENERATED_THEMES_FILE);

		file.write(
			`// This file is generated automatically. Do not edit it manually.\n\n`,
		);

		this.sx.themes.forEach((theme) => {
			file.write(`.${this.sx.config.prefix}-theme-${theme.name} {\n`);

			const themeVariables = Object.entries(theme.variables);

			themeVariables.forEach(([style, value], i) => {
				if (typeof value !== 'object' || value === null) {
					throw new Error(
						`@monorepo/styles: invalid theme variable "${style}"`,
					);
				}

				const variable = this.getStyleVariable(style);

				if (!variable.sub) {
					Object.entries(value).forEach(([key, val]) => {
						file.write(
							`\t--${this.sx.config.prefix}-${variable.base}-${key}: map-get($${style}, ${val});\n`,
						);
					});
				} else {
					variable.sub.forEach((sub, j) => {
						Object.entries(value).forEach(([key, val]) => {
							file.write(
								`\t--${this.sx.config.prefix}-${
									variable.base
								}-${sub}-${key}: nth(map-get($${style}, ${val}), ${j + 1});\n`,
							);
						});
					});
				}

				if (i !== themeVariables.length - 1) {
					file.write('\n');
				}
			});

			file.write(`}\n\n`);
		});
	}

	private getStyleVariable(name: string): Style['variable'] {
		for (let i = 0; i < this.sx.styles.length; i += 1) {
			const style = this.sx.styles[i];

			if (style.name === name) {
				return style.variable;
			}
		}

		throw new Error(`@monorepo/styles: style "${name}" not found`);
	}
}

export default ThemeGenerator;
