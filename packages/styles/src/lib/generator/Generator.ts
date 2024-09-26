import { Sx } from '../validation';
import Generative from './Generative';
import SxGenerator from './sx';
import ScssGenerator from './scss';
import ThemeGenerator from './theme';

class Generator implements Generative {
	private generators: Generative[] = [];

	public constructor(sx: Sx) {
		this.generators.push(new SxGenerator(sx));
		this.generators.push(new ScssGenerator(sx));
		this.generators.push(new ThemeGenerator(sx));
	}

	public generate(): void {
		this.generators.forEach((generator) => generator.generate());
	}
}

export default Generator;
