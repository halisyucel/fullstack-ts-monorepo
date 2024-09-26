import { number, object, string } from 'yup';

export const configSchema = object({
	prefix: string().required(),
	fontSize: number().required(),
	breakpoints: object()
		.required()
		.test({
			name: 'breakpoint-number-values',
			message: 'Breakpoint values must be numbers',
			test: (value) => {
				if (typeof value !== 'object') return false;
				return Object.values(value).every((v) => typeof v === 'number');
			},
		}),
});

export type Config = ReturnType<typeof configSchema.cast>;
