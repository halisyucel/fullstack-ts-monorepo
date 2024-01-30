import { array, object, string } from 'yup';

export const themeSchema = object({
	name: string().required(),
	variables: object().required(),
});

export const themesSchema = array()
	.of(themeSchema)
	.required()
	.test({
		name: 'themes-is-empty',
		message: 'themes must be non-empty array',
		test: (value) => value.length > 0,
	})
	.test({
		name: 'duplicate-themes',
		message: 'themes must be unique',
		test: (value) =>
			new Set(value.map((theme) => theme.name)).size === value.length,
	})
	.test({
		name: 'default-theme-exists',
		message: 'default theme must exist',
		test: (value) => value.some((theme) => theme.name === 'default'),
	});

export type Theme = ReturnType<typeof themeSchema.cast>;
