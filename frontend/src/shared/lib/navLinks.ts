export interface NavLink {
  path: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { path: '/', label: 'Home' },
  { path: '/customers', label: 'Customers' },
  { path: '/about', label: 'About' },
];
