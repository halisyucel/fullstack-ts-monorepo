import fs from 'fs';
import { exec } from 'node:child_process';
import { Sx } from '../../validation';
import Generative from '../Generative';

export default class SxGenerator implements Generative {
	private sx: Sx;

	private TEMPLATE_SX_FILE = 'src/lib/generator/sx/templates/sx';

	private TEMPLATE_PROPS_FILE = 'src/lib/generator/sx/templates/props';

	private TEMPLATE_GUARDS_FILE = 'src/lib/generator/sx/templates/guards';

	private GENERATED_SX_FILE = 'src/generated/sx/sx.ts';

	private GENERATED_ENUMS_FILE = 'src/generated/sx/enums.ts';

	private GENERATED_PROPS_FILE = 'src/generated/sx/props.ts';

	private GENERATED_TYPES_FILE = 'src/generated/sx/types.ts';

	private GENERATED_GUARDS_FILE = 'src/generated/sx/guards.ts';

	public constructor(sx: Sx) {
		this.sx = sx;
	}

	private template(str: string, args: string[]) {
		return str.replace(/<(\d+)>/g, (_, index) => args[parseInt(index)]);
	}

	private upperCamelCase(str: string): string {
		return str.replace(/(^|-)([a-z])/g, (_match, _p1, p2) => p2.toUpperCase());
	}

	private generateSxPropType(file: fs.WriteStream): void {
		file.write('export type SxProps = {\n');

		this.sx.props.forEach(({ prop }) => {
			prop.forEach((p) => {
				file.write(`\t${p}?: props.Sx${this.upperCamelCase(p)};\n`);
			});
		});

		file.write('};\n\n');
	}

	private generateSxMappings(file: fs.WriteStream): void {
		this.sx.props.forEach(({ prop, style, output }) => {
			const sxStyle = this.sx.styles.find(({ name }) => name === style)!;

			file.write(`\tif (${prop.map((p) => `!!${p}`).join(' || ')}) {\n`);

			file.write(
				`\t\tconst value = ${prop.map((p) => `${p}`).join(' || ')};\n`,
			);

			file.write(`\t\tif(guards.isSx${this.upperCamelCase(style)}(value)) {\n`);

			const generated = this.template(
				output.generated,
				sxStyle.variable.sub?.length
					? sxStyle.variable.sub.map(
							(sub) =>
								`var(--${this.sx.config.prefix}-${sxStyle.variable.base}-${sub}-\${value})`,
					  )
					: [
							`var(--${this.sx.config.prefix}-${sxStyle.variable.base}-\${value})`,
					  ],
			);

			file.write(`\t\t\temotion.push(\`${generated}\`);\n`);
			file.write('\t\t}\n');

			file.write(`\t\telse {`);

			const raw = this.template(output.raw, [`\${value}`]);

			file.write(`\t\t\temotion.push(\`${raw}\`)`);
			file.write('\t\t}\n');

			file.write(`\t}\n\n`);
		});
	}

	private generateSxBreakpoints(file: fs.WriteStream): void {}

	private generateSx(): void {
		if (fs.existsSync(this.GENERATED_SX_FILE)) {
			fs.unlinkSync(this.GENERATED_SX_FILE);
		}

		const file = fs.createWriteStream(this.GENERATED_SX_FILE);
		const template = fs.readFileSync(this.TEMPLATE_SX_FILE, 'utf8');

		file.write(template);
		file.write('\n');

		this.generateSxPropType(file);

		file.write('export default function sx({\n');

		this.sx.props.forEach(({ prop }) => {
			prop.forEach((p) => {
				file.write(`\t${p},\n`);
			});
		});

		file.write('}: SxProps): string {\n');
		file.write('\tconst emotion: string[] = [];\n\n');

		this.generateSxMappings(file);
		this.generateSxBreakpoints(file);

		file.write(`return css(emotion.join(''));`);
		file.write('}\n');

		file.end();

		exec(`yarn prettier --write ${this.GENERATED_SX_FILE}`);
	}

	private generateGuards(): void {
		if (fs.existsSync(this.GENERATED_GUARDS_FILE)) {
			fs.unlinkSync(this.GENERATED_GUARDS_FILE);
		}

		const file = fs.createWriteStream(this.GENERATED_GUARDS_FILE);
		const template = fs.readFileSync(this.TEMPLATE_GUARDS_FILE, 'utf8');

		file.write(template);
		file.write('\n');

		this.sx.styles.forEach((style) => {
			const name = this.upperCamelCase(style.name);

			file.write(
				`export function isSx${name}(value: unknown): value is types.Sx${name}Type {\n`,
			);
			file.write(
				`\treturn Object.keys(enums.Sx${name}Enum).includes(<string>value);\n`,
			);
			file.write('}\n');
		});

		file.end();

		exec(`yarn prettier --write ${this.GENERATED_GUARDS_FILE}`);
	}

	private generateEnums(): void {
		if (fs.existsSync(this.GENERATED_ENUMS_FILE)) {
			fs.unlinkSync(this.GENERATED_ENUMS_FILE);
		}

		const file = fs.createWriteStream(this.GENERATED_ENUMS_FILE);

		this.sx.styles.forEach((style) => {
			const keys = Object.keys(style.value);
			const name = this.upperCamelCase(style.name);

			file.write(`export enum Sx${name}Enum {\n`);

			keys.forEach((prop) => {
				file.write(`\t'${prop}' = '${prop}',\n`);
			});

			file.write('}\n');
		});

		file.end();

		exec(`yarn prettier --write ${this.GENERATED_ENUMS_FILE}`);
	}

	private generateTypes(): void {
		if (fs.existsSync(this.GENERATED_TYPES_FILE)) {
			fs.unlinkSync(this.GENERATED_TYPES_FILE);
		}

		const file = fs.createWriteStream(this.GENERATED_TYPES_FILE);

		this.sx.styles.forEach((style) => {
			const keys = Object.keys(style.value);
			const name = this.upperCamelCase(style.name);

			file.write(`export type Sx${name}Type =`);

			keys.forEach((prop) => {
				file.write(`\n\t| '${prop}'`);
			});

			file.write(';\n');
		});

		file.end();

		exec(`yarn prettier --write ${this.GENERATED_TYPES_FILE}`);
	}

	private generateProps(): void {
		if (fs.existsSync(this.GENERATED_PROPS_FILE)) {
			fs.unlinkSync(this.GENERATED_PROPS_FILE);
		}

		const file = fs.createWriteStream(this.GENERATED_PROPS_FILE);
		const template = fs.readFileSync(this.TEMPLATE_PROPS_FILE, 'utf8');

		file.write(template);
		file.write('\n');

		this.sx.props.forEach(({ prop, style, type }) => {
			prop.forEach((p) => {
				file.write(
					`export type Sx${this.upperCamelCase(
						p,
					)} = LiteralUnion<types.Sx${this.upperCamelCase(style)}Type, ${
						type ? `CSSProperties['${type}']` : `'${type}'`
					}>;\n`,
				);
			});
		});

		file.end();

		exec(`yarn prettier --write ${this.GENERATED_PROPS_FILE}`);
	}

	public generate(): void {
		this.generateTypes();
		this.generateEnums();
		this.generateProps();
		this.generateGuards();

		this.generateSx();
	}
}
