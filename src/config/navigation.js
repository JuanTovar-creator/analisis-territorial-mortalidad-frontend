import {
  Activity,
  BookOpenCheck,
  Database,
  GitCompareArrows,
  LayoutDashboard,
  Map,
  MapPinned,
  Settings2,
} from 'lucide-react'

export const ROLE_NAVIGATION = {
  admin: [
    {
      label: 'GESTIÓN',
      items: [
        { title: 'Panel principal', path: '/admin', icon: LayoutDashboard },
        { title: 'Datos', path: '/admin/data', icon: Database },
        { title: 'Evaluación y publicación', path: '/admin/evaluation', icon: BookOpenCheck },
      ],
    },
  ],
  client: [
    {
      label: 'ANÁLISIS',
      items: [
        { title: 'Resumen general', path: '/client', icon: LayoutDashboard },
        { title: 'Mapa territorial', path: '/client/map', icon: Map },
        { title: 'Municipios', path: '/client/municipalities', icon: MapPinned },
        { title: 'Comparación', path: '/client/comparison', icon: GitCompareArrows },
      ],
    },
  ],
}

export function findNavigationItem(role, pathname) {
  return ROLE_NAVIGATION[role]
    .flatMap((group) => group.items)
    .find((item) => item.path === pathname) ?? ROLE_NAVIGATION[role][0].items[0]
}
