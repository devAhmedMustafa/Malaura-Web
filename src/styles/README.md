# Malaura Design System

A comprehensive design system built for the Malaura web application, based on the brand preview designs. This system provides consistent styling, components, and utilities for building modern, responsive interfaces.

## 🎨 Design Principles

- **Consistency**: Unified visual language across all components
- **Mobile-First**: Responsive design that works on all devices  
- **Accessibility**: WCAG compliant and inclusive by default
- **Performance**: Optimized CSS with minimal bundle size
- **Maintainability**: Scalable architecture with clear organization

## 📁 File Structure

```
src/styles/
├── tokens.css          # Design tokens and CSS variables
├── utilities.css       # Utility classes for common patterns
├── components.css      # Pre-built component styles  
├── types.ts           # TypeScript definitions
├── index.ts           # Main export with utilities
└── README.md          # This documentation
```

## 🚀 Getting Started

The design system is automatically imported through `src/app/globals.css`. All utilities and components are available globally.

### Basic Usage

```tsx
// Using utility classes
<div className="flex items-center justify-between p-4 bg-gray-100">
  <h1 className="text-2xl font-bold text-primary">Welcome</h1>
  <button className="btn btn-primary">Get Started</button>
</div>
```

### TypeScript Integration

```tsx
import { theme, classNames, helpers } from '@/styles';
import type { ButtonProps, ColorNames } from '@/styles/types';

// Use theme object with CSS-in-JS
const styles = {
  container: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.gray100,
  }
};

// Generate class names programmatically
const buttonClass = classNames.components.button('primary', 'lg');
const spacingClass = classNames.spacing.padding(4);
```

## 🎯 Design Tokens

### Colors

```css
/* Primary Brand Colors */
--color-primary: #905f37;        /* Main brand color */
--color-primary-alt: #d2a81e;    /* Secondary brand color */
--color-primary-light: #b5824a;  /* Light variant */
--color-primary-dark: #6b4529;   /* Dark variant */

/* Neutral Colors */
--color-white: #fafaff;
--color-gray-100: #f0f1f3;       /* Lightest gray */
--color-gray-600: #606060;       /* Darkest gray */
--color-dark: #101010;           /* Near black */

/* Semantic Colors */
--color-success: #22c55e;        /* Green */
--color-warning: #f59e0b;        /* Orange */  
--color-error: #ef4444;          /* Red */
--color-info: #3b82f6;           /* Blue */
```

### Typography

```css
/* Font Sizes (Mobile First) */
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.813rem;   /* 13px */ 
--font-size-base: 0.938rem; /* 15px */
--font-size-lg: 1rem;       /* 16px */
--font-size-xl: 1.125rem;   /* 18px */
--font-size-2xl: 1.25rem;   /* 20px */
--font-size-3xl: 1.5rem;    /* 24px */
--font-size-4xl: 2rem;      /* 32px */
--font-size-5xl: 3rem;      /* 48px */
--font-size-6xl: 4rem;      /* 64px - Desktop: 96px */

/* Font Weights */
--font-weight-regular: 400;
--font-weight-semi: 600;
--font-weight-bold: 700;
```

### Spacing Scale

```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
```

## 🧩 Components

### Buttons

```tsx
<!-- Primary Button -->
<button className="btn btn-primary">Primary Action</button>

<!-- Secondary Button -->  
<button className="btn btn-secondary">Secondary</button>

<!-- Outline Button -->
<button className="btn btn-outline">Outline</button>

<!-- Small Button -->
<button className="btn btn-primary btn-sm">Small</button>

<!-- Large Button -->
<button className="btn btn-primary btn-lg">Large</button>

<!-- Full Width Button -->
<button className="btn btn-primary btn-full">Full Width</button>
```

### Cards

```tsx
<!-- Basic Card -->
<div className="card">
  <div className="card-body">
    <h3 className="card-title">Card Title</h3>
    <p className="card-text">Card content goes here.</p>
  </div>
</div>

<!-- Product Card -->
<div className="product-card">
  <div className="product-card-image">
    <div className="product-badge">NEW</div>
    <img src="/product.jpg" alt="Product" />
  </div>
  <div className="product-card-body">
    <h3 className="product-name">Product Name</h3>
    <p className="product-price">$99</p>
  </div>
</div>
```

### Navigation

```tsx
<header className="l-header">
  <nav className="nav">
    <a href="/" className="nav-brand">
      <img src="/logo.png" alt="Malaura" />
    </a>
    <ul className="nav-menu">
      <li><a href="/home" className="nav-link active">Home</a></li>
      <li><a href="/products" className="nav-link">Products</a></li>
      <li><a href="/about" className="nav-link">About</a></li>
    </ul>
    <div className="nav-actions">
      <i className="nav-icon fa-cart-plus"></i>
    </div>
  </nav>
</header>
```

### Alerts & Badges

```tsx
<!-- Alerts -->
<div className="alert alert-success">Success message</div>
<div className="alert alert-warning">Warning message</div>
<div className="alert alert-error">Error message</div>
<div className="alert alert-info">Info message</div>

<!-- Badges -->
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
```

## 🛠 Utility Classes

### Layout & Flexbox

```tsx
<!-- Flexbox -->
<div className="flex items-center justify-between">
<div className="flex flex-col gap-4">
<div className="grid grid-cols-3 gap-6">

<!-- Display -->
<div className="block">        <!-- display: block -->
<div className="hidden">       <!-- display: none -->  
<div className="flex">         <!-- display: flex -->
<div className="grid">         <!-- display: grid -->
```

### Spacing

```tsx
<!-- Margin -->
<div className="m-4">     <!-- margin: 1rem -->
<div className="mt-2">    <!-- margin-top: 0.5rem -->
<div className="mb-6">    <!-- margin-bottom: 1.5rem -->
<div className="mx-auto">  <!-- margin: 0 auto -->

<!-- Padding -->  
<div className="p-4">     <!-- padding: 1rem -->
<div className="px-6">    <!-- padding-left/right: 1.5rem -->
<div className="py-8">    <!-- padding-top/bottom: 2rem -->
```

### Typography

```tsx
<!-- Font Sizes -->
<h1 className="text-4xl">Large Heading</h1>
<p className="text-base">Body text</p>
<small className="text-sm">Small text</small>

<!-- Font Weights -->
<span className="font-normal">Regular text</span>
<span className="font-semibold">Semibold text</span>
<span className="font-bold">Bold text</span>

<!-- Text Alignment -->
<p className="text-left">Left aligned</p>
<p className="text-center">Center aligned</p>
<p className="text-right">Right aligned</p>

<!-- Text Colors -->
<p className="text-primary">Primary color</p>
<p className="text-dark">Dark text</p>
<p className="text-gray-500">Gray text</p>
```

### Colors

```tsx
<!-- Text Colors -->
<span className="text-primary">Primary text</span>
<span className="text-success">Success text</span>
<span className="text-error">Error text</span>

<!-- Background Colors -->
<div className="bg-primary">Primary background</div>
<div className="bg-gray-100">Light gray background</div>
<div className="bg-white">White background</div>
```

## 📱 Responsive Design

All utilities support responsive prefixes:

```tsx
<!-- Responsive Typography -->
<h1 className="text-2xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>

<!-- Responsive Layout -->
<div className="block md:flex lg:grid lg:grid-cols-3">
  Responsive container
</div>

<!-- Responsive Spacing -->
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>
```

### Breakpoints

- `sm`: 640px and up
- `md`: 768px and up  
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

## 🎨 CSS-in-JS Integration

For styled-components, emotion, or other CSS-in-JS libraries:

```tsx
import styled from 'styled-components';
import { theme } from '@/styles';

const StyledCard = styled.div`
  padding: ${theme.spacing[4]};
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.boxShadow.base};
  
  ${theme.mediaQuery.md} {
    padding: ${theme.spacing[6]};
  }
`;
```

## ♿ Accessibility

The design system includes accessibility features:

- **Focus indicators**: Visible focus styles for keyboard navigation
- **Color contrast**: WCAG AA compliant color combinations  
- **Reduced motion**: Respects `prefers-reduced-motion` setting
- **Semantic HTML**: Component styles work with proper HTML elements
- **Screen reader support**: Appropriate color choices and text sizing

## 🌙 Dark Mode

Dark mode is automatically supported via CSS custom properties:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-white: #1a1a1a;
    --color-dark: #fafaff;
    /* Other dark mode colors... */
  }
}
```

## 🔧 Customization

### Extending Colors

Add new colors to `tokens.css`:

```css
:root {
  /* Custom colors */
  --color-brand-purple: #8b5cf6;
  --color-brand-teal: #14b8a6;
}
```

### Adding Utility Classes

Add new utilities to `utilities.css`:

```css
/* Custom utilities */
.aspect-square { aspect-ratio: 1; }
.aspect-video { aspect-ratio: 16 / 9; }
```

### Creating Components

Add new components to `components.css`:

```css
.my-component {
  /* Component styles using design tokens */
  padding: var(--spacing-4);
  background-color: var(--color-primary);
  /* ... */
}
```

## 📚 Best Practices

1. **Use utility classes first** - Prefer utilities over custom CSS
2. **Follow naming conventions** - Use consistent naming patterns
3. **Leverage design tokens** - Always use CSS custom properties
4. **Test responsively** - Ensure components work on all screen sizes
5. **Consider accessibility** - Test with screen readers and keyboard navigation
6. **Optimize performance** - Use only the classes you need

## 🤝 Contributing

When adding new components or utilities:

1. Follow the established naming conventions
2. Use existing design tokens when possible
3. Add TypeScript types for new components
4. Update this documentation
5. Test across different screen sizes and devices
6. Ensure accessibility compliance

## 📄 License

This design system is part of the Malaura project and follows the same licensing terms.