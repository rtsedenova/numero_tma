import type { User } from '@telegram-apps/sdk-react';
import { useNavigate } from 'react-router-dom';

import { Avatar } from './Avatar';
import { CurrencyChip } from './CurrencyChip';
import { NotificationIcon } from './Notification';
import { usePredictionAttempts } from '@/storage/predictionAttempts';
import { useTelegramUser } from '@/hooks/useTelegramUser';

export interface AccountHeaderProps {
  user?: User;
  balance?: number;
  className?: string;
}

export function AccountHeader({
  user: userProp,
  balance: balanceProp,
  className = '',
}: AccountHeaderProps) {
  const navigate = useNavigate();
  const { user: userFromHook } = useTelegramUser();
  const {
    credits,
    isLoading: isPredictionsLoading,
  } = usePredictionAttempts();

  const user = userProp || userFromHook;

  const balance = credits !== null ? credits : balanceProp ?? 0;
  const balanceText =
    isPredictionsLoading && credits === null
      ? '...'
      : new Intl.NumberFormat('ru-RU').format(balance);

  const handleAvatarClick = () => {
    navigate('/profile');
  };

  return (
    <header className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-4">
        <button type="button" onClick={handleAvatarClick}>
          <Avatar
            src={user?.photoUrl}
            alt={`${user?.firstName || 'User'} avatar`}
            size={54}
          />
        </button>

        <div className="flex flex-col gap-1.5 leading-tight md:flex-row md:items-center">
          <span className="text-[15px] font-medium text-violet-200 md:text-[16px]">
            {user?.firstName || 'User'}
          </span>

          <div className="flex md:hidden">
            <CurrencyChip value={balanceText} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex">
          <CurrencyChip value={balanceText} />
        </div>
        <NotificationIcon size={24} />
      </div>
    </header>
  );
}
