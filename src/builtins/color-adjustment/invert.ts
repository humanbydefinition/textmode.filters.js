import { defineBuiltinFilter } from '../definition';
import invertSource from './invert.frag';

export const invertFilter = defineBuiltinFilter({
	id: 'invert',
	shader: invertSource,
	uniforms: {},
});
