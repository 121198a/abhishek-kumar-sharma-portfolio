import { useState } from 'react';
import { TreeIcon } from '../../icons';
import { hikingItems } from '../../data/navItems';
import { useNavMenu } from '../../hooks/useNavMenu';
import { MenuToggle } from '../MenuToggle/MenuToggle';
import { NavLinks } from '../NavLinks/NavLinks';
import { CarabinerIcon } from './CarabinerIcon';
import styles from './HikingNav.module.css';

export function HikingNav({ items = hikingItems, label = 'Hiking and outdoor' }) {
  const [activeId, setActiveId] = useState(items[0].id);
  const { isOpen, toggle, close, menuId, rootRef, toggleRef } = useNavMenu();

  const handleNavigate = (id) => {
    setActiveId(id);
    close();
  };

  return (
    <nav ref={rootRef} className={styles.nav} aria-label={label} data-open={isOpen}>
      <CarabinerIcon />

      <MenuToggle isOpen={isOpen} onClick={toggle} controls={menuId} toggleRef={toggleRef} />

      <NavLinks
        id={menuId}
        open={isOpen}
        items={items}
        activeId={activeId}
        onNavigate={handleNavigate}
        classes={styles}
      />

      <TreeIcon className={styles.tip} />
    </nav>
  );
}
