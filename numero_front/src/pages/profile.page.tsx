import { FC } from "react";
import { Page } from '@/components/Page';
import { useSignal } from "@telegram-apps/sdk-react";
import { initData } from "@telegram-apps/sdk-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { CurrencyChip } from "@/components/CurrencyChip";
import { Avatar } from "@/components/Avatar";
import { usePredictionAttempts } from "@/storage/predictionAttempts";

export const ProfilePage: FC = () => {
  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;

  const { credits, isLoading: isPredictionsLoading } = usePredictionAttempts();

  if (!user) {
    return (
      <div className="profile-page">
        <p>Данные пользователя не найдены.</p>
      </div>
    );
  }

  return (
    <Page>
      <div className="profile-page">
        <div className="profile-page__top-bar">
          <ThemeToggle />
        </div>

        <div className="profile-page__profile-section">
          <Avatar
            src={user.photoUrl}
            alt={`${user.firstName} ${user.lastName} avatar`}
            size={120}
            className="profile-page__avatar"
          />
          <div className="profile-page__info">
            <div className="profile-page__name">
              {user.firstName} {user.lastName}
            </div>
            {user.username && (
              <div className="profile-page__username">@{user.username}</div>
            )}
          </div>
        </div>

        <div className="profile-page__coins">
          <CurrencyChip
            value={
              isPredictionsLoading || credits === null ? '...' : String(credits)
            }
          />
        </div>

        <ul className="profile-page__settings">
          {user.isPremium && <li>Премиум: Активен ✨</li>}
        </ul>

        <div className="profile-page__invite">
          <button className="profile-page__button">Пригласить друзей</button>
        </div>
      </div>
    </Page>
  );
};
