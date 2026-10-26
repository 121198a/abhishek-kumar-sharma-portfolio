import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { UsnayaLogo } from './UsnayaLogo';
import { UsnayaNavbarProps, NavItem, ThemeMode } from './types';
import styles from './UsnayaNavbar.module.css';

const DEFAULT_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'team', label: 'Our Team', href: '#team' },
  { id: 'virtual-office', label: 'Virtual Office', href: '#virtual-office' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const UsnayaNavbar: React.FC<UsnayaNavbarProps> = ({
  items = DEFAULT_ITEMS,
  activeId: controlledActiveId,
  onItemClick,
  onCtaClick,
  ctaLabel = 'Explore Our Office',
  className = '',
  theme: controlledTheme,
  onThemeToggle,
}) => {
  const [internalActiveId, setInternalActiveId] = useState<string>(items[0]?.id || 'home');
  const [internalTheme, setInternalTheme] = useState<ThemeMode>('dark');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  const currentActiveId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;
  const currentTheme = controlledTheme !== undefined ? controlledTheme : internalTheme;

  // Sync data-theme attribute with document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ESC key for mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = currentTheme === 'dark' ? 'light' : 'dark';
    setInternalTheme(nextTheme);
    if (onThemeToggle) {
      onThemeToggle(nextTheme);
    }
  };

  const handleLinkClick = (item: NavItem) => {
    setInternalActiveId(item.id);
    if (onItemClick) {
      onItemClick(item);
    }
    setIsMobileMenuOpen(false);
  };

  const handleCtaAction = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      window.location.hash = '#virtual-office';
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`${styles.navWrapper} ${isScrolled ? styles.scrolledWrapper : ''} ${className}`}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      role="banner"
    >
      <div className={styles.perimeterRing}>
        <nav
          className={`${styles.navbarInner} ${isScrolled ? styles.scrolledInner : ''}`}
          aria-label="Main Navigation"
        >
          <div className={styles.specularReflection} />

          {/* Left: Brand */}
          <UsnayaLogo />

          {/* Center: Desktop Menu */}
          <ul className={styles.navLinksList} role="menubar">
            {items.map((item) => {
              const isActive = currentActiveId === item.id;
              return (
                <li key={item.id} className={styles.navItem} role="none">
                  <a
                    href={item.href}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item);
                    }}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <motion.div
                        className={styles.activeIndicator}
                        layoutId="usnayaActiveIndicator"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 380, damping: 30 }
                        }
                      />
                    )}
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right Controls: Theme Switcher & CTA */}
          <div className={styles.rightControls}>
            {/* Theme Toggle Button */}
            <button
              type="button"
              className={styles.themeToggleBtn}
              onClick={toggleTheme}
              aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {currentTheme === 'dark' ? (
                /* Sun Icon for Dark Mode */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                /* Moon Icon for Light Mode */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Desktop CTA */}
            <button
              type="button"
              className={styles.ctaButton}
              onClick={handleCtaAction}
              aria-label={ctaLabel}
            >
              <div className={styles.lightSweep} />
              <span>{ctaLabel}</span>
              <span className={styles.ctaArrow} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className={styles.mobileMenuToggle}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="usnaya-mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <span className={styles.hamburgerIcon}>
                <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barOpen1 : ''}`} />
                <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barOpen2 : ''}`} />
                <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barOpen3 : ''}`} />
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="usnaya-mobile-menu"
            className={styles.mobileDrawer}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className={styles.mobileNavList}>
              {items.map((item, index) => {
                const isActive = currentActiveId === item.id;
                return (
                  <motion.li
                    key={item.id}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                  >
                    <a
                      href={item.href}
                      className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(item);
                      }}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="4" fill="#00f0ff" />
                        </svg>
                      )}
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            <button
              type="button"
              className={`${styles.ctaButton} ${styles.mobileCta}`}
              onClick={handleCtaAction}
            >
              <div className={styles.lightSweep} />
              <span>{ctaLabel}</span>
              <span className={styles.ctaArrow} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};