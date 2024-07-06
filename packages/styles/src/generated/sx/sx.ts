import { css } from '@emotion/css';

import * as props from './props';
import * as guards from './guards';

export type SxProps = {
	fs?: props.SxFs;
	fontSize?: props.SxFontSize;
	fw?: props.SxFw;
	fontWeight?: props.SxFontWeight;
	ff?: props.SxFf;
	fontFamily?: props.SxFontFamily;
	bg?: props.SxBg;
	background?: props.SxBackground;
};

export default function sx({
	fs,
	fontSize,
	fw,
	fontWeight,
	ff,
	fontFamily,
	bg,
	background,
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

	if (!!bg || !!background) {
		const value = bg || background;
		if (guards.isSxColor(value)) {
			emotion.push(`background: var(--ui-color-${value});`);
		} else {
			emotion.push(`background: ${value};`);
		}
	}

	return css(emotion.join(''));
}
