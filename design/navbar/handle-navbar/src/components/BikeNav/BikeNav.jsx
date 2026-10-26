import { useState } from 'react';
import { BikeIcon } from '../../icons';
import { bikeItems } from '../../data/navItems';
import { useNavMenu } from '../../hooks/useNavMenu';
import { MenuToggle } from '../MenuToggle/MenuToggle';
import { NavLinks } from '../NavLinks/NavLinks';
import styles from './BikeNav.module.css';

const listClasses = {
  start: { list: `${styles.list} ${styles.listStart}`, item: styles.item, link: styles.link, icon: styles.icon },
  end: { list: `${styles.list} ${styles.listEnd}`, item: styles.item, link: styles.link, icon: styles.icon },
};

export function BikeNav({ items = bikeItems, label = 'Bike brand' }) {
  const [activeId, setActiveId] = useState(items.start[0].id);
  const { isOpen, toggle, close, menuId, rootRef, toggleRef } = useNavMenu();

  const handleNavigate = (id) => {
    setActiveId(id);
    close();
  };

  return (
    <nav ref={rootRef} className={styles.nav} aria-label={label}>
      <a className={styles.brand} href={items.start[0].href} aria-label={`${label}, home`}>
        <BikeIcon />
      </a>

      <MenuToggle isOpen={isOpen} onClick={toggle} controls={menuId} toggleRef={toggleRef} />

      {/* Wrapper only exists so one aria-controls target covers both lists. */}
      <div id={menuId} className={styles.menu} data-open={isOpen}>
        <NavLinks
          items={items.start}
          activeId={activeId}
          onNavigate={handleNavigate}
          classes={listClasses.start}
        />
        <NavLinks
          items={items.end}
          activeId={activeId}
          onNavigate={handleNavigate}
          classes={listClasses.end}
        />
      </div>
    </nav>
  );
}
