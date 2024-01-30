import { array, object, string } from 'yup';

export const propSchema = object({
	prop: array().of(string().required()).required(),
	style: string().required(),
	output: object({
		raw: string(),
		generated: string(),
	}).required(),
})
	.test({
		name: 'prop-is-empty',
		message: 'prop must be non-empty array',
		test: (value) => value.prop.length > 0,
	})
	.test({
		name: 'output-least-one',
		message: 'output must have at least one key',
		test: (value) => Object.keys(value.output).length > 0,
	});

export const propsSchema = array()
	.of(propSchema)
	.required()
	.test({
		name: 'duplicate-props',
		message: 'prop name must be unique',
		test: (value) => {
			const names = value.map((prop) => prop.prop).flat();
			return new Set(names).size === names.length;
		},
	});

export type Prop = ReturnType<typeof propSchema.cast>;
