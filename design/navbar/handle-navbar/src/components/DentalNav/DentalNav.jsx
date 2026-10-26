import { useState } from 'react';
import { ToothIcon } from '../../icons';
import { dentalItems } from '../../data/navItems';
import { useNavMenu } from '../../hooks/useNavMenu';
import { MenuToggle } from '../MenuToggle/MenuToggle';
import { NavLinks } from '../NavLinks/NavLinks';
import styles from './DentalNav.module.css';

export function DentalNav({ items = dentalItems, label = 'Dental clinic' }) {
  const [activeId, setActiveId] = useState(items[0].id);
  const { isOpen, toggle, close, menuId, rootRef, toggleRef } = useNavMenu();

  const handleNavigate = (id) => {
    setActiveId(id);
    close();
  };

  return (
    <nav ref={rootRef} className={styles.nav} aria-label={label} data-open={isOpen}>
      <a className={styles.brand} href={items[0].href} aria-label={`${label}, home`}>
        <ToothIcon />
      </a>

      <MenuToggle isOpen={isOpen} onClick={toggle} controls={menuId} toggleRef={toggleRef} />

      <NavLinks
        id={menuId}
        open={isOpen}
        items={items}
        activeId={activeId}
        onNavigate={handleNavigate}
        classes={styles}
      />
    </nav>
  );
}
