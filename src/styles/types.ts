/**
 * Malaura Design System TypeScript Definitions
 * 
 * These types provide type safety and IntelliSense for the design system
 * when used with styled-components, CSS-in-JS, or utility functions.
 */

/*===== Color System =====*/
export type ColorTokens = {
  // Primary Colors
  primary: string;
  primaryAlt: string;
  primaryLight: string;
  primaryDark: string;
  
  // Neutral Colors
  white: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  dark: string;
  darkLight: string;
  
  // Semantic Colors
  success: string;
  warning: string;
  error: string;
  info: string;
};

export type ColorNames = keyof ColorTokens;

/*===== Typography System =====*/
export type FontSizes = {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
};

export type FontWeights = {
  regular: number;
  semi: number;
  bold: number;
};

export type LineHeights = {
  tight: number;
  normal: number;
  relaxed: number;
  loose: number;
};

export type FontSizeNames = keyof FontSizes;
export type FontWeightNames = keyof FontWeights;
export type LineHeightNames = keyof LineHeights;

/*===== Spacing System =====*/
export type SpacingScale = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
};

export type SpacingNames = keyof SpacingScale;

/*===== Border Radius System =====*/
export type BorderRadius = {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
};

export type BorderRadiusNames = keyof BorderRadius;

/*===== Shadow System =====*/
export type Shadows = {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
};

export type ShadowNames = keyof Shadows;

/*===== Z-Index System =====*/
export type ZIndex = {
  dropdown: number;
  tooltip: number;
  modal: number;
  overlay: number;
  fixed: number;
};

export type ZIndexNames = keyof ZIndex;

/*===== Transition System =====*/
export type Transitions = {
  fast: string;
  base: string;
  slow: string;
};

export type TransitionNames = keyof Transitions;

/*===== Breakpoint System =====*/
export type Breakpoints = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
};

export type BreakpointNames = keyof Breakpoints;

/*===== Complete Theme Interface =====*/
export interface Theme {
  colors: ColorTokens;
  fontSizes: FontSizes;
  fontWeights: FontWeights;
  lineHeights: LineHeights;
  spacing: SpacingScale;
  borderRadius: BorderRadius;
  shadows: Shadows;
  zIndex: ZIndex;
  transitions: Transitions;
  breakpoints: Breakpoints;
  fontFamily: {
    primary: string;
  };
}

/*===== Component Prop Types =====*/
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'base' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface AlertProps {
  variant: AlertVariant;
  title?: string;
  dismissible?: boolean;
}

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'base';
}

/*===== Utility Class Types =====*/
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type Display = 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'hidden';
export type FlexDirection = 'row' | 'col';
export type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type Position = 'static' | 'fixed' | 'absolute' | 'relative' | 'sticky';

/*===== CSS Custom Property Helpers =====*/
export type CSSCustomProperties = {
  [K in keyof Theme as `--${string}`]: string;
};

/*===== Responsive Prefix Types =====*/
export type ResponsivePrefix = '' | 'sm:' | 'md:' | 'lg:' | 'xl:';

/*===== Utility Function Types =====*/
export type GetColorFunction = (colorName: ColorNames) => string;
export type GetSpacingFunction = (spacingName: SpacingNames) => string;
export type GetFontSizeFunction = (sizeName: FontSizeNames) => string;

/*===== Design Token Constants =====*/
export const DESIGN_TOKENS = {
  colors: {
    primary: '#905f37',
    primaryAlt: '#d2a81e',
    primaryLight: '#b5824a',
    primaryDark: '#6b4529',
    white: '#fafaff',
    gray100: '#f0f1f3',
    gray200: '#e0e1e3',
    gray300: '#d0d1d3',
    gray400: '#a0a1a3',
    gray500: '#808183',
    gray600: '#606060',
    dark: '#101010',
    darkLight: '#606060',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  } as const,
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.813rem',
    base: '0.938rem',
    lg: '1rem',
    xl: '1.125rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
    '4xl': '2rem',
    '5xl': '3rem',
    '6xl': '4rem',
  } as const,
  
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  } as const,
} as const;

/*===== Type Guards =====*/
export const isValidColor = (color: string): color is ColorNames => {
  return color in DESIGN_TOKENS.colors;
};

export const isValidSpacing = (spacing: string | number): spacing is SpacingNames => {
  return String(spacing) in DESIGN_TOKENS.spacing;
};

export const isValidFontSize = (fontSize: string): fontSize is FontSizeNames => {
  return fontSize in DESIGN_TOKENS.fontSizes;
};

/*===== Utility Functions =====*/
export const getColor = (colorName: ColorNames): string => {
  return `var(--color-${colorName.replace(/([A-Z])/g, '-$1').toLowerCase()})`;
};

export const getSpacing = (spacingName: SpacingNames): string => {
  return `var(--spacing-${spacingName})`;
};

export const getFontSize = (sizeName: FontSizeNames): string => {
  return `var(--font-size-${sizeName})`;
};

/*===== CSS-in-JS Helpers =====*/
export const mediaQuery = {
  sm: `@media screen and (min-width: 640px)`,
  md: `@media screen and (min-width: 768px)`,
  lg: `@media screen and (min-width: 1024px)`,
  xl: `@media screen and (min-width: 1280px)`,
  '2xl': `@media screen and (min-width: 1536px)`,
} as const;

export const darkMode = `@media (prefers-color-scheme: dark)`;
export const reducedMotion = `@media (prefers-reduced-motion: reduce)`;

/*===== Re-export all types for convenience =====*/
// All types are already exported above, no need to re-export