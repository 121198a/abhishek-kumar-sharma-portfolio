/**
 * Navigation content lives here, away from markup and styling.
 * Each item: { id, label, href, icon } where icon is a key of ICONS.
 */

export const dentalItems = [
  { id: 'home', label: 'Home', href: '#dental-home', icon: 'home' },
  { id: 'services', label: 'Services', href: '#dental-services', icon: 'tooth' },
  { id: 'about', label: 'About us', href: '#dental-about', icon: 'users' },
  { id: 'gallery', label: 'Smile gallery', href: '#dental-gallery', icon: 'camera' },
  { id: 'reviews', label: 'Reviews', href: '#dental-reviews', icon: 'star' },
  { id: 'contact', label: 'Contact', href: '#dental-contact', icon: 'phone' },
];

export const bikeItems = {
  start: [
    { id: 'home', label: 'Home', href: '#bike-home', icon: 'home' },
    { id: 'bikes', label: 'Bikes', href: '#bike-bikes', icon: 'bike' },
    { id: 'gear', label: 'Gear', href: '#bike-gear', icon: 'helmet' },
  ],
  end: [
    { id: 'about', label: 'About', href: '#bike-about', icon: 'user' },
    { id: 'blog', label: 'Blog', href: '#bike-blog', icon: 'doc' },
    { id: 'contact', label: 'Contact', href: '#bike-contact', icon: 'mail' },
  ],
};

export const hikingItems = [
  { id: 'home', label: 'Home', href: '#hike-home', icon: 'mountain' },
  { id: 'trails', label: 'Trails', href: '#hike-trails', icon: 'signpost' },
  { id: 'gear', label: 'Gear', href: '#hike-gear', icon: 'backpack' },
  { id: 'guides', label: 'Guides', href: '#hike-guides', icon: 'compass' },
  { id: 'blog', label: 'Blog', href: '#hike-blog', icon: 'doc' },
  { id: 'contact', label: 'Contact', href: '#hike-contact', icon: 'chat' },
];
