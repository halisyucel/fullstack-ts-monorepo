import { array, mixed, object, string, ValidationError } from 'yup';
import { StyleType } from '../types';

const styleTypeSchema = array().of(
	mixed<StyleType>().oneOf(Object.values(StyleType)).defined(),
);

const variableSchema = object({
	base: string().required(),
	sub: array().of(string().required()),
});

export const styleSchema = object({
	name: string().required(),
	type: styleTypeSchema.required(),
	variable: variableSchema.required(),
	value: object().required(),
})
	.test({
		name: 'value-exist',
		test: ({ value }) => {
			const keys = Object.keys(value);

			for (let i = 0; i < keys.length; i += 1) {
				const key = keys[i];
				const val: unknown = value[key as keyof typeof value];

				if (!key.trim()) {
					return new ValidationError('key must not be empty', value, key);
				}

				if (Array.isArray(val)) {
					for (let j = 0; j < val.length; j += 1) {
						if (typeof val[j] === 'string' && !val[j].trim()) {
							return new ValidationError(
								`value[${j}] must not be empty`,
								value,
								key,
							);
						}
					}

					return true;
				}

				if (typeof val === 'string' && !val.trim()) {
					return new ValidationError('value must not be empty', value, key);
				}
			}

			return true;
		},
	})
	.test({
		name: 'type-variable-match',
		message: ({ path, value }) =>
			`${path} type and variable type do not match in ${JSON.stringify(value)}`,
		test: ({ type, variable }) => {
			if (type.length === 1) {
				return true;
			}

			return type.length === variable?.sub?.length;
		},
	})
	.test({
		name: 'type-value-match',
		test: ({ type, value }) => {
			const keys = Object.keys(value);

			for (let i = 0; i < keys.length; i += 1) {
				const key = keys[i];
				const val: unknown = value[key as keyof typeof value];

				if (type.length === 1) {
					if (typeof val !== 'string' && typeof val !== 'number') {
						return new ValidationError(
							`value of "${key}" must be string or number`,
							value,
							key,
						);
					}

					return true;
				}

				if (!Array.isArray(val)) {
					return new ValidationError(
						`value of "${key}" must be array`,
						value,
						key,
					);
				}

				for (let j = 0; j < val.length; j += 1) {
					const t = type[j];

					if (t === StyleType.pixel) {
						if (typeof val[j] !== 'number') {
							return new ValidationError(
								`value[${j}] of "${key}" must be number`,
								value,
								key,
							);
						}
					}

					if (t === StyleType.raw) {
						if (typeof val[j] !== 'string' && typeof val[j] !== 'number') {
							return new ValidationError(
								`value[${j}] of "${key}" must be string or number`,
								value,
								key,
							);
						}
					}

					if (t === StyleType.string) {
						if (typeof val[j] !== 'string') {
							return new ValidationError(
								`value[${j}] of "${key}" must be string`,
								value,
								key,
							);
						}

						if (!val[j].startsWith("'") || !val[j].endsWith("'")) {
							return new ValidationError(
								`value[${j}] of "${key}" must be quoted`,
								value,
								key,
							);
						}
					}
				}
			}

			return true;
		},
	});

export const stylesSchema = array().of(styleSchema).required().nonNullable();

export type Style = NonNullable<ReturnType<typeof styleSchema.cast>>;
