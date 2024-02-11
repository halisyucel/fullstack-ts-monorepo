import fs from 'fs';
import { exec } from 'node:child_process';
import { Sx } from '../../validation';
import Generative from '../Generative';

export default class SxGenerator implements Generative {
	private sx: Sx;

	private GENERATED_PROPS_FILE = 'src/generated/sx/props.ts';

	private GENERATED_TYPES_FILE = 'src/generated/sx/types.ts';

	private TEMPLATE_TYPES_FILE = 'src/lib/generator/sx/templates/types';

	public constructor(sx: Sx) {
		this.sx = sx;
	}

	private upperCamelCase(str: string): string {
		return str.replace(/(^|-)([a-z])/g, (_match, _p1, p2) => p2.toUpperCase());
	}

	private generateTypes(): void {
		if (fs.existsSync(this.GENERATED_TYPES_FILE)) {
			fs.unlinkSync(this.GENERATED_TYPES_FILE);
		}

		const file = fs.createWriteStream(this.GENERATED_TYPES_FILE);
		const template = fs.readFileSync(this.TEMPLATE_TYPES_FILE, 'utf8');

		file.write(template);
		file.write('\n// --- types ---\n\n');

		this.sx.styles.forEach((style) => {
			const keys = Object.keys(style.value);
			const name = this.upperCamelCase(style.name);

			file.write(`export type Sx${name}Type =`);

			keys.forEach((prop) => {
				file.write(`\n\t| '${prop}'`);
			});

			file.write(';\n');

			file.write(`export const Sx${name}TypeKeys = [\n`);

			keys.forEach((prop) => {
				file.write(`\t'${prop}',\n`);
			});

			file.write('] as const;\n\n');
		});

		file.write('\n// --- props ---\n');

		this.sx.props.forEach(({ prop, style, type }) => {
			prop.forEach((p) => {
				file.write(
					`export type Sx${this.upperCamelCase(
						p,
					)} = LiteralUnion<Sx${this.upperCamelCase(style)}Type, ${
						type ? `CSSProperties['${type}']` : `'${type}'`
					}>;\n`,
				);
			});

			file.write('\n');
		});

		file.end();

		exec('yarn prettier --write src/generated/sx/types.ts');
	}

	public generate(): void {
		this.generateTypes();

		// 2. sonra mapping script'ini oluştur
		// 3. sonra oluşturulan type'ı sx'e ekle
	}
}
