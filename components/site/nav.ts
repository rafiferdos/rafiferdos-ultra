// Targets are the section ids that exist today; they move to /#work and /#about as phases 3 to 8 rebuild the sections.
export const navItems = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#whyme' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Writing', href: '/#writing' },
  { label: 'Contact', href: '/#contact' }
] as const
