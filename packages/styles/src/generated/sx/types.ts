import { CSSProperties } from 'react';

export type LiteralUnion<T extends U, U> = T | (U & { _?: never });

// --- types ---

export type SxBorderWidthType = 'none' | 'thin' | 'medium' | 'thick';
export const SxBorderWidthTypeKeys = [
	'none',
	'thin',
	'medium',
	'thick',
] as const;

export type SxBorderStyleType =
	| 'none'
	| 'solid'
	| 'dashed'
	| 'dotted'
	| 'double';
export const SxBorderStyleTypeKeys = [
	'none',
	'solid',
	'dashed',
	'dotted',
	'double',
] as const;

export type SxColorType =
	| 'red-50'
	| 'red-100'
	| 'red-200'
	| 'red-300'
	| 'red-400'
	| 'red-500'
	| 'red-600'
	| 'red-700'
	| 'red-800'
	| 'red-900'
	| 'red-950';
export const SxColorTypeKeys = [
	'red-50',
	'red-100',
	'red-200',
	'red-300',
	'red-400',
	'red-500',
	'red-600',
	'red-700',
	'red-800',
	'red-900',
	'red-950',
] as const;

export type SxOutlineWidthType = 'thin' | 'medium' | 'thick';
export const SxOutlineWidthTypeKeys = ['thin', 'medium', 'thick'] as const;

export type SxOutlineStyleType =
	| 'none'
	| 'solid'
	| 'dashed'
	| 'dotted'
	| 'double';
export const SxOutlineStyleTypeKeys = [
	'none',
	'solid',
	'dashed',
	'dotted',
	'double',
] as const;

export type SxOutlineOffsetType = 'none' | 'sm' | 'md' | 'lg';
export const SxOutlineOffsetTypeKeys = ['none', 'sm', 'md', 'lg'] as const;

export type SxFontSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export const SxFontSizeTypeKeys = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export type SxFontFamilyType = 'sans' | 'serif' | 'mono';
export const SxFontFamilyTypeKeys = ['sans', 'serif', 'mono'] as const;

export type SxFontWeightType =
	| 'thin'
	| 'extralight'
	| 'light'
	| 'normal'
	| 'medium'
	| 'semibold'
	| 'bold'
	| 'extrabold'
	| 'black';
export const SxFontWeightTypeKeys = [
	'thin',
	'extralight',
	'light',
	'normal',
	'medium',
	'semibold',
	'bold',
	'extrabold',
	'black',
] as const;

// --- props ---
export type SxFs = LiteralUnion<SxFontSizeType, CSSProperties['fontSize']>;
export type SxFontSize = LiteralUnion<
	SxFontSizeType,
	CSSProperties['fontSize']
>;

export type SxFw = LiteralUnion<SxFontWeightType, CSSProperties['fontWeight']>;
export type SxFontWeight = LiteralUnion<
	SxFontWeightType,
	CSSProperties['fontWeight']
>;

export type SxFf = LiteralUnion<SxFontFamilyType, CSSProperties['fontFamily']>;
export type SxFontFamily = LiteralUnion<
	SxFontFamilyType,
	CSSProperties['fontFamily']
>;
