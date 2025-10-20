import { Link, useLocation } from 'react-router-dom';
import { House, Eye, User } from 'phosphor-react';

const navItems = [
  { to: '/', icon: <House size={28} />, label: 'Home' },
  { to: '/numerology', icon: <Eye size={28} />, label: 'Destiny' },
  { to: '/profile', icon: <User size={28} />, label: 'Profile' },
];

export function BottomNavbar() {
  const location = useLocation();

  return (
    <nav className="bottom-navbar" aria-label="Bottom navigation">
      <ul className="bottom-navbar__list">
        {navItems.map(({ to, icon, label }, idx) => {
          const isActive = location.pathname === to;
          return (
            <li
              key={idx}
              className={`bottom-navbar__item${isActive ? ' bottom-navbar__item--active' : ''}`}
            >
              <Link
                to={to}
                className="bottom-navbar__link"
                aria-label={label}
              >
                {icon}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
