import { ICONS } from '../../icons';

/**
 * A semantic list of links. Visual treatment comes entirely from the
 * `classes` object, so each themed nav owns its own look.
 *
 * `id` / `open` are optional: pass them when this list is itself the
 * collapsible menu so a toggle can reference it with aria-controls.
 */
export function NavLinks({ id, open, items, activeId, onNavigate, classes }) {
  return (
    <ul id={id} className={classes.list} data-open={open}>
      {items.map(({ id: itemId, label, href, icon }) => {
        const Icon = ICONS[icon];
        return (
          <li key={itemId} className={classes.item}>
            <a
              className={classes.link}
              href={href}
              aria-current={itemId === activeId ? 'page' : undefined}
              onClick={() => onNavigate(itemId)}
            >
              <Icon className={classes.icon} />
              <span>{label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
