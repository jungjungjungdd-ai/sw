import type { ReactNode, SVGProps } from 'react'

export type AppIconName =
  | 'bookmark'
  | 'cafe'
  | 'chevronRight'
  | 'landmark'
  | 'location'
  | 'mapPin'
  | 'mic'
  | 'plus'
  | 'restaurant'
  | 'restroom'
  | 'route'
  | 'search'
  | 'user'
  | 'wheelchair'

interface AppIconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  name: AppIconName
  size?: number
}

export default function AppIcon({ name, size = 20, ...props }: AppIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  }

  const paths: Record<AppIconName, ReactNode> = {
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    mapPin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    location: <><path d="M12 3 4.5 20.5 12 17l7.5 3.5L12 3Z" /><path d="m12 3 0 14" /></>,
    route: <><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6h3a3 3 0 0 1 3 3v6a3 3 0 0 0 3 3" /></>,
    bookmark: <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z" />,
    user: <><circle cx="12" cy="8" r="3.8" /><path d="M4.5 20c1.5-4 4.2-6 7.5-6s6 2 7.5 6" /></>,
    wheelchair: <><circle cx="10" cy="4.5" r="1.7" /><path d="M10 7.5v5h4l2.5 4.5" /><path d="M10 12.5 7.5 17a4.5 4.5 0 1 0 7.7 3.2" /></>,
    restaurant: <><path d="M7 3v8" /><path d="M4.5 3v4a2.5 2.5 0 0 0 5 0V3" /><path d="M7 11v10" /><path d="M16 3v18" /><path d="M16 3c3 1 3 6 0 7" /></>,
    restroom: <><circle cx="8" cy="5" r="1.7" /><circle cx="16" cy="5" r="1.7" /><path d="M5.5 20v-7.5h5V20" /><path d="M13.5 20v-7.5h5V20" /><path d="M6 9.5h4" /><path d="M14 9.5h4" /></>,
    cafe: <><path d="M5 9h11v8.5A3.5 3.5 0 0 1 12.5 21h-4A3.5 3.5 0 0 1 5 17.5V9Z" /><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" /><path d="M8 4v2" /><path d="M12 3v3" /></>,
    landmark: <><path d="M3 21h18" /><path d="M5 18h14" /><path d="m4 9 8-5 8 5" /><path d="M6.5 9v9" /><path d="M10.5 9v9" /><path d="M14.5 9v9" /><path d="M18 9v9" /></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0" /><path d="M12 17v4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
  }

  return <svg {...common}>{paths[name]}</svg>
}
