/**
 * Malaura Design System - Main Export File
 * 
 * This file provides a convenient way to import all design system utilities,
 * types, and constants from a single location.
 */

// Re-export all types and utilities
export * from './types';

// Design system configuration
export const designSystem = {
  name: 'Malaura Design System',
  version: '1.0.0',
  description: 'A comprehensive design system based on the Malaura brand preview',
  
  // CSS file paths for manual imports
  cssFiles: {
    tokens: '/src/styles/tokens.css',
    utilities: '/src/styles/utilities.css',
    components: '/src/styles/components.css',
    globals: '/src/app/globals.css',
  },
  
  // Design principles
  principles: [
    'Consistency across all components',
    'Mobile-first responsive design',
    'Accessibility and inclusivity',
    'Performance and maintainability',
    'Brand-aligned visual hierarchy',
  ],
} as const;

// Utility class name generators
export const classNames = {
  /**
   * Generate spacing class names
   */
  spacing: {
    margin: (size: string | number) => `m-${size}`,
    marginTop: (size: string | number) => `mt-${size}`,
    marginBottom: (size: string | number) => `mb-${size}`,
    marginX: (size: string | number) => `mx-${size}`,
    marginY: (size: string | number) => `my-${size}`,
    padding: (size: string | number) => `p-${size}`,
    paddingTop: (size: string | number) => `pt-${size}`,
    paddingBottom: (size: string | number) => `pb-${size}`,
    paddingX: (size: string | number) => `px-${size}`,
    paddingY: (size: string | number) => `py-${size}`,
  },
  
  /**
   * Generate typography class names
   */
  typography: {
    size: (size: string) => `text-${size}`,
    weight: (weight: string) => `font-${weight}`,
    align: (align: string) => `text-${align}`,
    color: (color: string) => `text-${color}`,
  },
  
  /**
   * Generate layout class names
   */
  layout: {
    display: (display: string) => display,
    flex: {
      direction: (direction: string) => `flex-${direction}`,
      justify: (justify: string) => `justify-${justify}`,
      align: (align: string) => `items-${align}`,
      wrap: (wrap: string) => `flex-${wrap}`,
    },
    grid: {
      cols: (cols: string | number) => `grid-cols-${cols}`,
      span: (span: string | number) => `col-span-${span}`,
      gap: (gap: string | number) => `gap-${gap}`,
    },
  },
  
  /**
   * Generate component class names
   */
  components: {
    button: (variant: string = 'primary', size: string = 'base') => 
      `btn btn-${variant}${size !== 'base' ? ` btn-${size}` : ''}`,
    card: () => 'card',
    badge: (variant: string = 'primary') => `badge badge-${variant}`,
    alert: (variant: string) => `alert alert-${variant}`,
  },
};

// CSS-in-JS theme object (for styled-components, emotion, etc.)
export const theme = {
  colors: {
    primary: 'var(--color-primary)',
    primaryAlt: 'var(--color-primary-alt)',
    white: 'var(--color-white)',
    dark: 'var(--color-dark)',
    gray100: 'var(--color-gray-100)',
    gray200: 'var(--color-gray-200)',
    gray300: 'var(--color-gray-300)',
    gray400: 'var(--color-gray-400)',
    gray500: 'var(--color-gray-500)',
    gray600: 'var(--color-gray-600)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    info: 'var(--color-info)',
  },
  
  spacing: {
    0: 'var(--spacing-0)',
    1: 'var(--spacing-1)',
    2: 'var(--spacing-2)',
    3: 'var(--spacing-3)',
    4: 'var(--spacing-4)',
    5: 'var(--spacing-5)',
    6: 'var(--spacing-6)',
    8: 'var(--spacing-8)',
    10: 'var(--spacing-10)',
    12: 'var(--spacing-12)',
    16: 'var(--spacing-16)',
    20: 'var(--spacing-20)',
    24: 'var(--spacing-24)',
  },
  
  fontSize: {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    '2xl': 'var(--font-size-2xl)',
    '3xl': 'var(--font-size-3xl)',
    '4xl': 'var(--font-size-4xl)',
    '5xl': 'var(--font-size-5xl)',
    '6xl': 'var(--font-size-6xl)',
  },
  
  fontWeight: {
    regular: 'var(--font-weight-regular)',
    semi: 'var(--font-weight-semi)',
    bold: 'var(--font-weight-bold)',
  },
  
  borderRadius: {
    none: 'var(--radius-none)',
    sm: 'var(--radius-sm)',
    base: 'var(--radius-base)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
    full: 'var(--radius-full)',
  },
  
  boxShadow: {
    sm: 'var(--shadow-sm)',
    base: 'var(--shadow-base)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
  },
  
  zIndex: {
    dropdown: 'var(--z-dropdown)',
    tooltip: 'var(--z-tooltip)',
    modal: 'var(--z-modal)',
    overlay: 'var(--z-overlay)',
    fixed: 'var(--z-fixed)',
  },
  
  transition: {
    fast: 'var(--transition-fast)',
    base: 'var(--transition-base)',
    slow: 'var(--transition-slow)',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Helper functions
export const helpers = {
  /**
   * Combine multiple class names, filtering out falsy values
   */
  cn: (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
  },
  
  /**
   * Create responsive class names
   */
  responsive: (
    base: string,
    sm?: string,
    md?: string,
    lg?: string,
    xl?: string
  ): string => {
    const classes = [base];
    if (sm) classes.push(`sm:${sm}`);
    if (md) classes.push(`md:${md}`);
    if (lg) classes.push(`lg:${lg}`);
    if (xl) classes.push(`xl:${xl}`);
    return classes.join(' ');
  },
  
  /**
   * Get CSS custom property value
   */
  getCSSVar: (property: string): string => `var(--${property})`,
  
  /**
   * Create media query strings
   */
  mediaQuery: (breakpoint: keyof typeof theme.breakpoints): string => 
    `@media screen and (min-width: ${theme.breakpoints[breakpoint]})`,
};

// Default export
export default {
  designSystem,
  classNames,
  theme,
  helpers,
};