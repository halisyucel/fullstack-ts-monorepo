import Parser from '../lib/parser';
import Generator from '../lib/generator';

const sx = Parser.parse();
const generator = new Generator(sx);

generator.generate();
