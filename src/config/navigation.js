import {
  Activity,
  BookOpenCheck,
  Database,
  FileBarChart2,
  GitCompareArrows,
  LayoutDashboard,
  MapPinned,
  Settings2,
  UserRound,
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
    {
      label: 'CUENTA',
      items: [{ title: 'Mi cuenta', path: '/admin/account', icon: UserRound }],
    },
  ],
  client: [
    {
      label: 'ANÁLISIS',
      items: [
        { title: 'Resumen general', path: '/client', icon: LayoutDashboard },
        { title: 'Municipios', path: '/client/municipalities', icon: MapPinned },
        { title: 'Comparación', path: '/client/comparison', icon: GitCompareArrows },
        { title: 'Informes', path: '/client/reports', icon: FileBarChart2 },
        { title: 'Metodología', path: '/client/methodology', icon: BookOpenCheck },
      ],
    },
    {
      label: 'CUENTA',
      items: [{ title: 'Mi cuenta', path: '/client/account', icon: UserRound }],
    },
  ],
}

export function findNavigationItem(role, pathname) {
  return ROLE_NAVIGATION[role]
    .flatMap((group) => group.items)
    .find((item) => item.path === pathname) ?? ROLE_NAVIGATION[role][0].items[0]
}
