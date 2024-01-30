import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

class PathResolver {
	private readonly STYLE_FOLDER = 'src/sx/utilities';

	private readonly THEME_FOLDER = 'src/sx/themes';

	private readonly CONFIG_FILE = 'src/sx/sx.yaml';

	private readonly GENERATED_STYLE_FOLDER = 'src/utilities';

	private readonly GENERATED_THEME_FOLDER = 'src/themes';

	private readonly GENERATED_GLOBALS_FILE = 'src/globals.scss';

	private readonly GENERATED_FOLDERS = [
		'src/abstracts',
		'src/vendors',
		'src/utilities',
		'src/themes',
	];

	private readonly root: string;

	private readonly stylePaths: string[] = [];

	private readonly themePaths: string[] = [];

	private configPath: string | undefined;

	private readonly styles: Record<string, object> = {};

	private readonly themes: Record<string, object> = {};

	private config: object = {};

	constructor(root: string) {
		this.root = PathResolver.getRootPath(root);

		if (!fs.existsSync(this.root))
			throw new Error(`style package not found at ${this.root}`);

		this.load();
		this.resolve();
	}

	private load(): void {
		const stylePath = path.join(this.root, this.STYLE_FOLDER);
		const themePath = path.join(this.root, this.THEME_FOLDER);
		const configPath = path.join(this.root, this.CONFIG_FILE);

		if (!fs.existsSync(stylePath))
			throw new Error(`style folder not found at ${stylePath}`);

		if (!fs.existsSync(themePath))
			throw new Error(`theme folder not found at ${themePath}`);

		if (!fs.existsSync(configPath))
			throw new Error(`styleX config file not found at ${configPath}`);

		this.stylePaths.push(...fs.readdirSync(stylePath));
		this.themePaths.push(...fs.readdirSync(themePath));
		this.configPath = configPath;
	}

	private resolve(): void {
		this.stylePaths.forEach((stylePath) => {
			if (['.yaml', '.yml'].indexOf(path.extname(stylePath)) === -1) {
				throw new Error('style file must be a yaml file');
			}

			const filePath = path.join(this.root, this.STYLE_FOLDER, stylePath);
			const file = fs.readFileSync(filePath, 'utf8');
			const data = yaml.load(file);

			this.styles[path.basename(stylePath, path.extname(stylePath))] =
				data as object;
		});

		this.themePaths.forEach((themePath) => {
			if (['.yaml', '.yml'].indexOf(path.extname(themePath)) === -1) {
				throw new Error('theme file must be a yaml file');
			}

			const filePath = path.join(this.root, this.THEME_FOLDER, themePath);
			const file = fs.readFileSync(filePath, 'utf8');
			const data = yaml.load(file);

			this.themes[path.basename(themePath, path.extname(themePath))] =
				data as object;
		});

		if (!this.configPath) throw new Error('config path not found');

		if (['.yaml', '.yml'].indexOf(path.extname(this.configPath)) === -1) {
			throw new Error('config file must be a yaml file');
		}

		const file = fs.readFileSync(this.configPath, 'utf8');
		const data = yaml.load(file);
		this.config = data as object;
	}

	public getStyles(): Record<string, object> {
		return this.styles;
	}

	public getThemes(): Record<string, object> {
		return this.themes;
	}

	public getConfig(): object {
		return this.config;
	}

	public getGeneratedStyleFolder(): string {
		return path.join(this.root, this.GENERATED_STYLE_FOLDER);
	}

	public getGeneratedThemeFolder(): string {
		return path.join(this.root, this.GENERATED_THEME_FOLDER);
	}

	public getGeneratedGlobalsFile(): string {
		return path.join(this.root, this.GENERATED_GLOBALS_FILE);
	}

	public getGeneratedFolders(): string[] {
		return this.GENERATED_FOLDERS.map((folder) => path.join(this.root, folder));
	}

	private static getRootPath(root: string): string {
		return path.join(__dirname, '../../../..', root);
	}
}

export default PathResolver;
