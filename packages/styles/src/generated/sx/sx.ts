import * as props from './props';
import * as guards from './guards';
import { css } from '@emotion/css';

export type SxProps = {
	fs?: props.SxFs;
	fontSize?: props.SxFontSize;
	fw?: props.SxFw;
	fontWeight?: props.SxFontWeight;
	ff?: props.SxFf;
	fontFamily?: props.SxFontFamily;
};

export default function sx({
	fs,
	fontSize,
	fw,
	fontWeight,
	ff,
	fontFamily,
}: SxProps): string {
	const emotion: string[] = [];

	if (!!fs || !!fontSize) {
		const value = fs || fontSize;
		if (guards.isSxFontSize(value)) {
			emotion.push(
				`font-size: var(--ui-fs-size-${value}); line-height: var(--ui-fs-height-${value});`,
			);
		} else {
			emotion.push(`font-size: ${value};`);
		}
	}

	if (!!fw || !!fontWeight) {
		const value = fw || fontWeight;
		if (guards.isSxFontWeight(value)) {
			emotion.push(`font-weight: var(--ui-fw-${value});`);
		} else {
			emotion.push(`font-weight: ${value};`);
		}
	}

	if (!!ff || !!fontFamily) {
		const value = ff || fontFamily;
		if (guards.isSxFontFamily(value)) {
			emotion.push(`font-family: var(--ui-ff-${value});`);
		} else {
			emotion.push(`font-family: ${value};`);
		}
	}

	return css(emotion.join(''));
}
