import { Sx } from '../validation';
import Generative from './generative';
import StyleGenerator from './style-generator';
import ThemeGenerator from './theme-generator';

class Generator implements Generative {
	private generators: Generative[] = [];

	public constructor(sx: Sx) {
		this.generators.push(new StyleGenerator(sx));
		this.generators.push(new ThemeGenerator(sx));
	}

	public generate(): void {
		this.generators.forEach((generator) => generator.generate());
	}
}

export default Generator;
