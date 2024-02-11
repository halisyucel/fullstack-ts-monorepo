import * as types from './types';
import { CSSProperties } from 'react';

export type LiteralUnion<T extends U, U> = T | (U & { _?: never });

export type SxFs = LiteralUnion<
	types.SxFontSizeType,
	CSSProperties['fontSize']
>;
export type SxFontSize = LiteralUnion<
	types.SxFontSizeType,
	CSSProperties['fontSize']
>;
export type SxFw = LiteralUnion<
	types.SxFontWeightType,
	CSSProperties['fontWeight']
>;
export type SxFontWeight = LiteralUnion<
	types.SxFontWeightType,
	CSSProperties['fontWeight']
>;
export type SxFf = LiteralUnion<
	types.SxFontFamilyType,
	CSSProperties['fontFamily']
>;
export type SxFontFamily = LiteralUnion<
	types.SxFontFamilyType,
	CSSProperties['fontFamily']
>;
