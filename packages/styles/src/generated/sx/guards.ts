import * as types from './types';
import * as enums from './enums';

export function isSxBorderWidth(
	value: unknown,
): value is types.SxBorderWidthType {
	return Object.keys(enums.SxBorderWidthEnum).includes(<string>value);
}
export function isSxBorderStyle(
	value: unknown,
): value is types.SxBorderStyleType {
	return Object.keys(enums.SxBorderStyleEnum).includes(<string>value);
}
export function isSxColor(value: unknown): value is types.SxColorType {
	return Object.keys(enums.SxColorEnum).includes(<string>value);
}
export function isSxOutlineWidth(
	value: unknown,
): value is types.SxOutlineWidthType {
	return Object.keys(enums.SxOutlineWidthEnum).includes(<string>value);
}
export function isSxOutlineStyle(
	value: unknown,
): value is types.SxOutlineStyleType {
	return Object.keys(enums.SxOutlineStyleEnum).includes(<string>value);
}
export function isSxOutlineOffset(
	value: unknown,
): value is types.SxOutlineOffsetType {
	return Object.keys(enums.SxOutlineOffsetEnum).includes(<string>value);
}
export function isSxFontSize(value: unknown): value is types.SxFontSizeType {
	return Object.keys(enums.SxFontSizeEnum).includes(<string>value);
}
export function isSxFontFamily(
	value: unknown,
): value is types.SxFontFamilyType {
	return Object.keys(enums.SxFontFamilyEnum).includes(<string>value);
}
export function isSxFontWeight(
	value: unknown,
): value is types.SxFontWeightType {
	return Object.keys(enums.SxFontWeightEnum).includes(<string>value);
}
