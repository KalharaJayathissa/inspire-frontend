/**
 * Responsive utility classes and helpers for consistent breakpoint usage across the application
 */

export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Helper function to determine the current breakpoint based on window width
 */
export const getCurrentBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') return 'md'; // SSR fallback
  
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

/**
 * Check if the current screen size is at or above a certain breakpoint
 */
export const isBreakpointAndUp = (breakpoint: Breakpoint): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS[breakpoint];
};

/**
 * Check if the current screen size is below a certain breakpoint
 */
export const isBreakpointAndDown = (breakpoint: Breakpoint): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS[breakpoint];
};

/**
 * Responsive spacing classes for consistent mobile-first design
 */
export const responsiveSpacing = {
  // Padding classes
  padding: {
    section: 'py-16 sm:py-20 lg:py-24',
    container: 'px-4 sm:px-6 lg:px-8',
    card: 'p-4 sm:p-6 lg:p-8',
    tight: 'p-2 sm:p-3 lg:p-4',
  },
  // Margin classes
  margin: {
    section: 'mb-12 sm:mb-16 lg:mb-20',
    element: 'mb-4 sm:mb-6 lg:mb-8',
    tight: 'mb-2 sm:mb-3 lg:mb-4',
  },
  // Gap classes for flex/grid
  gap: {
    grid: 'gap-4 sm:gap-6 lg:gap-8',
    flex: 'gap-2 sm:gap-3 lg:gap-4',
    large: 'gap-6 sm:gap-8 lg:gap-12',
  },
} as const;

/**
 * Responsive typography classes
 */
export const responsiveTypography = {
  heading: {
    hero: 'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl',
    h1: 'text-2xl sm:text-3xl lg:text-4xl',
    h2: 'text-xl sm:text-2xl lg:text-3xl',
    h3: 'text-lg sm:text-xl lg:text-2xl',
    h4: 'text-base sm:text-lg lg:text-xl',
  },
  body: {
    large: 'text-base sm:text-lg lg:text-xl',
    default: 'text-sm sm:text-base',
    small: 'text-xs sm:text-sm',
  },
} as const;

/**
 * Responsive layout classes
 */
export const responsiveLayout = {
  // Common grid patterns
  grid: {
    auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    cards: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    features: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    twoColumn: 'grid-cols-1 lg:grid-cols-2',
  },
  // Flex patterns
  flex: {
    center: 'flex flex-col sm:flex-row items-center justify-center',
    between: 'flex flex-col sm:flex-row items-center justify-between',
    stack: 'flex flex-col',
    row: 'flex flex-col sm:flex-row',
  },
  // Container widths
  container: {
    full: 'w-full',
    content: 'max-w-4xl mx-auto',
    wide: 'max-w-6xl mx-auto',
    narrow: 'max-w-2xl mx-auto',
  },
} as const;

/**
 * Responsive component sizes
 */
export const responsiveComponents = {
  button: {
    size: 'h-10 sm:h-11 text-sm sm:text-base px-4 sm:px-6',
    icon: 'h-8 w-8 sm:h-10 sm:w-10',
  },
  input: {
    size: 'h-10 sm:h-11 text-sm sm:text-base',
  },
  card: {
    padding: 'p-4 sm:p-6',
    spacing: 'space-y-3 sm:space-y-4',
  },
} as const;

/**
 * Helper function to conditionally apply responsive classes
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};