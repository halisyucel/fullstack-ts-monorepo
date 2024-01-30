import { object } from 'yup';
import { propsSchema } from './prop';
import { stylesSchema } from './style';
import { themesSchema } from './theme';
import { configSchema } from './config';

export const sxSchema = object({
	props: propsSchema.required(),
	config: configSchema.required(),
	styles: stylesSchema.required(),
	themes: themesSchema.required(),
});

export type Sx = NonNullable<ReturnType<typeof sxSchema.cast>>;
