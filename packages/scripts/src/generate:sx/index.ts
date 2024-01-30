import { program } from 'commander';

import Parser from './parser';
import Generator from './generator';

program
	.option('--ui-path <path>', 'path to the ui package', 'packages/ui')
	.option(
		'--styles-path <path>',
		'path to the styles package',
		'packages/styles',
	)
	.option('--update-version', 'update version in package.json', false);

program.parse();

const options = program.opts();

const parser = new Parser(options.stylesPath);
const generator = new Generator(options.stylesPath);

const sx = parser.parse();

generator.generate(sx);
