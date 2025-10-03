import { FC, useState } from "react";
import { Page } from '@/components/Page';
import { useSignal } from "@telegram-apps/sdk-react";
import { initData } from "@telegram-apps/sdk-react";

import { GearSix } from "phosphor-react"; // иконка настроек
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";

export const ProfilePage: FC = () => {
  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;

  const [showSettings, setShowSettings] = useState(false);

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
        <div className="profile-page__header">
          {user.photoUrl && (
            <img
              src={user.photoUrl}
              alt="Аватар"
              className="profile-page__avatar"
            />
          )}
          <div className="profile-page__info">
            <div className="profile-page__name">
              {user.firstName} {user.lastName}
            </div>
            {user.username && (
              <div className="profile-page__username">@{user.username}</div>
            )}
          </div>
          <button
            className="profile-page__settings-icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            <GearSix size={24} weight="bold" />
          </button>
        </div>

        <div className="profile-page__coins">
          💰 <strong>124</strong> монеты
        </div>

        <ul className="profile-page__settings">
          <li>Язык: {user.languageCode?.toUpperCase() || "RU"}</li>
          {user.isPremium && <li>Премиум: Активен ✨</li>}
          {showSettings && (
            <li className="profile-page__theme-section">
              <span>Тема:</span>
              <ThemeToggle />
            </li>
          )}
        </ul>

        <div className="profile-page__section">
          <h3>Моя статистика</h3>
          <ul>
            <li>Всего предсказаний: 15</li>
            <li>Избранные: 3</li>
            <li>Процент совпадений: 80%</li>
          </ul>
        </div>

        <div className="profile-page__invite">
          <button className="profile-page__button">Пригласить друзей</button>
        </div>
      </div>
    </Page>
  );
};
