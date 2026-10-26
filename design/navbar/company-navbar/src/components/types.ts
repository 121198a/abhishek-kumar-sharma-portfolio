export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export type ThemeMode = 'dark' | 'light';

export interface UsnayaNavbarProps {
  items?: NavItem[];
  activeId?: string;
  onItemClick?: (item: NavItem) => void;
  onCtaClick?: () => void;
  ctaLabel?: string;
  className?: string;
  theme?: ThemeMode;
  onThemeToggle?: (newTheme: ThemeMode) => void;
}