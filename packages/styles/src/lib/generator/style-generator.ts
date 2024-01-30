import fs from 'fs';
import { Sx } from '../validation';
import { StyleType } from '../types';
import Generative from './generative';

class StyleGenerator implements Generative {
	private sx: Sx;

	private GENERATED_STYLES_FILE = 'src/generated:scss/styles.scss';

	constructor(sx: Sx) {
		this.sx = sx;
	}

	public generate(): void {
		if (fs.existsSync(this.GENERATED_STYLES_FILE)) {
			fs.unlinkSync(this.GENERATED_STYLES_FILE);
		}

		const file = fs.createWriteStream(this.GENERATED_STYLES_FILE);

		file.write('// This file is generated. Do not edit.\n\n');

		this.sx.styles.forEach((style) => {
			file.write(`$${style.name}: (\n`);

			Object.entries(style.value).forEach(([key, value]) => {
				file.write(
					`\t${key}: ${this.generateSCSSMapValue(style.type, value)},\n`,
				);
			});

			file.write(');\n\n');

			file.write(`:root {\n`);

			Object.keys(style.value).forEach((key) => {
				if (!style.variable.sub) {
					file.write(
						`\t--${this.sx.config.prefix}-${style.variable.base}-${key}: map-get($${style.name}, ${key});\n`,
					);
				} else {
					style.variable.sub.forEach((sub, index) => {
						file.write(
							`\t--${this.sx.config.prefix}-${
								style.variable.base
							}-${sub}-${key}: nth(map-get($${style.name}, ${key}), ${
								index + 1
							});\n`,
						);
					});
				}
			});

			file.write('}\n\n');
		});
	}

	private generateSCSSMapValue(type: StyleType[], value: unknown): string {
		const result: string[] = [];

		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i += 1) {
				result.push(this.typeToScss(type[i], value[i]));
			}

			return `(${result.join(', ')})`;
		}

		return this.typeToScss(type[0], value);
	}

	private typeToScss(type: StyleType, value: unknown): string {
		switch (type) {
			case StyleType.string:
				return `"${value}"`;
			case StyleType.pixel:
				return this.pixelToRem(value as number);
			case StyleType.raw:
				return value as string;
			default:
				throw new Error(`@monorepo/styles: unknown style type ${type}`);
		}
	}

	private pixelToRem(value: number): string {
		return `${Math.round((value / this.sx.config.fontSize) * 1000) / 1000}rem`;
	}
}

export default StyleGenerator;
