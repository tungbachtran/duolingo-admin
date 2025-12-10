import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  Lightbulb,
  Home,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/',
  },
  {
    title: 'Courses',
    icon: BookOpen,
    href: '/courses',
  },
  {
    title: 'Units',
    icon: Layers,
    href: '/units',
  },
  {
    title: 'Lessons',
    icon: FileText,
    href: '/lessons',
  },
  {
    title: 'Questions',
    icon: HelpCircle,
    href: '/questions',
  },
  {
    title: 'Theories',
    icon: Lightbulb,
    href: '/theories',
  },
  {
    title: 'Role',
    icon: Lightbulb,
    href: '/role',
  },

  {
    title: 'Account',
    icon: Lightbulb,
    href: '/account',
  },
] as const;

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50">
      <div className="flex h-16 items-center border-b px-6">
      <p className="text-2xl font-bold text-green-600">Duolingo Admin</p>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-green-100 text-green-900'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
