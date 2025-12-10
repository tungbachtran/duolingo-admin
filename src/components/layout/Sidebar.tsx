import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  Lightbulb,
  Home,
  UserRoundPen,
  KeyRound,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { User } from '@/types/user.types';

// Map menu items to required permissions
const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/',
    permission: 'profile',
  },
  {
    title: 'Courses',
    icon: BookOpen,
    href: '/courses',
    permission: 'course.view',
  },
  {
    title: 'Units',
    icon: Layers,
    href: '/units',
    permission: 'unit.view',
  },
  {
    title: 'Lessons',
    icon: FileText,
    href: '/lessons',
    permission: 'lesson.view',
  },
  {
    title: 'Questions',
    icon: HelpCircle,
    href: '/questions',
    permission: 'question.view',
  },
  {
    title: 'Theories',
    icon: Lightbulb,
    href: '/theories',
    permission: 'theory.view',
  },
  {
    title: 'Role',
    icon: KeyRound,
    href: '/role',
    permission: 'role.view',
  },
  {
    title: 'Account',
    icon: UserRoundPen,
    href: '/account',
    permission: 'account.view',
  },
] as const;

export const Sidebar = ({ user }: { user?: User }) => {
  const location = useLocation();

  // Lấy danh sách permissions từ user
  const permissions = user?.roleId?.permissions || [];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50">
      <div className="flex h-16 items-center border-b px-6">
        <p className="text-2xl font-bold text-green-600">Duolingo Admin</p>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {menuItems
          .filter((item) => permissions.includes(item.permission))
          .map((item) => {
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
