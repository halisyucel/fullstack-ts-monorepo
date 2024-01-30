import schema from './schema';

import PathResolver from './path-resolver';
import { Style, StyleX, Config, Theme } from './types';

class Parser {
	private readonly resolver: PathResolver;

	constructor(path: string) {
		this.resolver = new PathResolver(path);
	}

	/**
	 * @description
	 * parse the styleX package and return the styleX object
	 * @returns {StyleX}
	 * @memberof Parser
	 */
	public parse(): StyleX {
		const config = this.parseConfig();
		const styles = this.parseStyles();
		const themes = this.parseThemes();

		this.check();

		return {
			config,
			styles,
			themes,
		};
	}

	/**
	 * @description
	 * parse the styleX config file and return the config object
	 * @private
	 * @returns {Config}
	 * @memberof Parser
	 */
	private parseConfig(): Config {
		console.log(this.resolver.getConfig());
		return {} as Config;
	}

	/**
	 * @description
	 * parse the styleX style files and return the style object array
	 * @private
	 * @returns {Style[]}
	 * @memberof Parser
	 */
	private parseStyles(): Record<string, Style[]> {
		const result: Record<string, Style[]> = {};
		const styles = this.resolver.getStyles();

		Object.entries(styles).forEach(([key, value]) => {
			result[key] = schema.style.validateSync(value);
		});

		return result;
	}

	/**
	 * @description
	 * parse the styleX theme files and return the theme object array
	 * @private
	 * @returns {Theme[]}
	 * @memberof Parser
	 */
	private parseThemes(): Record<string, Theme> {
		const result: Record<string, Theme> = {};
		const themes = this.resolver.getThemes();

		console.log(themes);

		return result;
	}

	/**
	 * @description
	 * check if the styleX config file is valid
	 * @private
	 * @memberof Parser
	 */
	private check(): void {
		console.log(this.resolver.getConfig());
	}
}

export default Parser;
