/**
 * Decorative icon set. Every icon is hidden from assistive tech because the
 * link/button that contains it always carries a visible text label or an
 * explicit aria-label.
 */
function Svg({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p) => (
  <Svg {...p}>
    <path d="M3 11 12 3l9 8" />
    <path d="M5 10v10h14V10" />
    <path d="M10 20v-6h4v6" />
  </Svg>
);

export const ToothIcon = (p) => (
  <Svg {...p}>
    <path d="M8 3C5.500 3 4 4.800 4 7.200c0 1.800.8 2.800 1.200 4.800.4 2 .6 8 2.300 8 1.500 0 1.200-4.500 2.500-4.500s1 4.500 2.500 4.500c1.700 0 1.900-6 2.300-8 .4-2 1.200-3 1.200-4.800C16 4.800 14.500 3 12 3c-1.500 0-2 .7-3 .7S9.500 3 8 3z" transform="translate(2 0)" />
  </Svg>
);

export const UsersIcon = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3.300 2.700-6 6-6s6 2.700 6 6" />
    <circle cx="17" cy="9" r="2.500" />
    <path d="M17 14c2.500 0 4 2 4 5" />
  </Svg>
);

export const CameraIcon = (p) => (
  <Svg {...p}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.500" />
  </Svg>
);

export const StarIcon = (p) => (
  <Svg {...p}>
    <path d="m12 3 2.800 5.800 6.200.9-4.500 4.400 1.100 6.200L12 17.300l-5.600 3 1.100-6.200L3 9.700l6.200-.9z" />
  </Svg>
);

export const PhoneIcon = (p) => (
  <Svg {...p}>
    <path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </Svg>
);

export const BikeIcon = (p) => (
  <Svg {...p}>
    <circle cx="6" cy="16" r="3.500" />
    <circle cx="18" cy="16" r="3.500" />
    <path d="m6 16 4-8h5l3 8M10 8l2 8M9 6h3" />
  </Svg>
);

export const HelmetIcon = (p) => (
  <Svg {...p}>
    <path d="M4 15a8 8 0 0 1 16 0z" />
    <path d="M4 15v2h16v-2M12 7v4M8 9l1 3M16 9l-1 3" />
  </Svg>
);

export const UserIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.400 3.600-8 8-8s8 3.600 8 8" />
  </Svg>
);

export const DocIcon = (p) => (
  <Svg {...p}>
    <path d="M6 3h9l4 4v14H6z" />
    <path d="M9 11h7M9 15h7M9 7h3" />
  </Svg>
);

export const MailIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
);

export const MountainIcon = (p) => (
  <Svg {...p}>
    <path d="m2 20 7-13 4 7 3-5 6 11z" />
  </Svg>
);

export const SignpostIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3v18M7 6h9l2 2-2 2H7zM17 13H8l-2 2 2 2h9z" />
  </Svg>
);

export const BackpackIcon = (p) => (
  <Svg {...p}>
    <path d="M8 6a4 4 0 0 1 8 0" />
    <rect x="5" y="6" width="14" height="15" rx="3" />
    <path d="M9 14h6M9 11h6" />
  </Svg>
);

export const CompassIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.500 8.500-2 5-5 2 2-5z" />
  </Svg>
);

export const ChatIcon = (p) => (
  <Svg {...p}>
    <path d="M4 5h16v11H10l-4 4v-4H4z" />
  </Svg>
);

export const MenuIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const CloseIcon = (p) => (
  <Svg {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
);

export const TreeIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3 6 11h3l-3 5h4v5h4v-5h4l-3-5h3z" fill="currentColor" stroke="none" />
  </Svg>
);

/** Lookup used by nav data so items stay plain, serialisable objects. */
export const ICONS = {
  home: HomeIcon,
  tooth: ToothIcon,
  users: UsersIcon,
  camera: CameraIcon,
  star: StarIcon,
  phone: PhoneIcon,
  bike: BikeIcon,
  helmet: HelmetIcon,
  user: UserIcon,
  doc: DocIcon,
  mail: MailIcon,
  mountain: MountainIcon,
  signpost: SignpostIcon,
  backpack: BackpackIcon,
  compass: CompassIcon,
  chat: ChatIcon,
};
