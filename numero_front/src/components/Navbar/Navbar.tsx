import { FC } from "react";
import { Link, useLocation } from 'react-router-dom';
import "@/styles/components/bottom-navbar.scss";

export const BottomNavbar: FC = () => {
    const location = useLocation();
  
    const navItems = [
      { href: '/profile', label: 'Профиль' },
      { href: '/calculate-destiny-number', label: 'Число судьбы' },
      { href: '/tasks', label: 'Задачи' },
      { href: '/settings', label: 'Настройки' },
    ];
  
    return (
      <nav className="bottom-navbar">
        <ul className="bottom-navbar__list">
          {navItems.map((item) => (
            <li
              key={item.href}
              className={`bottom-navbar__item ${
                location.pathname === item.href ? 'bottom-navbar__item--active' : ''
              }`}
            >
              <Link to={item.href} className="bottom-navbar__link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

