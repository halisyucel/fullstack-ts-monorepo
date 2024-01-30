// eslint-disable-next-line import/no-extraneous-dependencies
import { array, mixed, object, string } from 'yup';
import { CSSType } from './types';

const style = array()
	.of(
		object({
			name: string().required(),
			type: array()
				.of(mixed<CSSType>().oneOf(['string', 'raw', 'pixel']).required())
				.required(),
			variable: object({
				base: string().required(),
				sub: array().of(string().required()),
			})
				.required()
				.test({
					name: 'variable.sub',
					message: 'variable.sub must be an array and match the type',
					test: (variable, context) => {
						const type = context.parent.type as CSSType[];

						if (type.length === 1) return true;
						if (!variable?.sub) return true;

						return (
							variable?.sub instanceof Array &&
							type.length === variable.sub?.length
						);
					},
				}),
			value: object()
				.required()
				.test({
					name: 'value',
					message: 'value must be an string array and match the type',
					test: (record, context) => {
						const type = context.parent.type as CSSType[];

						return Object.keys(record).every((key) => {
							const value = record[key as keyof typeof record] as unknown;

							return value instanceof Array && type.length === value.length;
						});
					},
				}),
		})
			.required()
			.nonNullable(),
	)
	.required()
	.nonNullable();

const theme = object({
	name: string().required(),
	defaults: object().required(),
	variables: object().required(),
	breakpoints: object().required(),
});

const config = object({
	props: array().of(object().required()).required(),
});

export default {
	style,
	theme,
	config,
};
