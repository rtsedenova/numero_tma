import { FC } from "react";
import { Page } from '@/components/Page';
import { useSignal } from "@telegram-apps/sdk-react";
import { initData } from "@telegram-apps/sdk-react";
import "@/styles/pages/profile-page.scss";

export const ProfilePage: FC = () => {
  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;

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
        </div>

        <div className="profile-page__details">
          <div><strong>Язык:</strong> {user.languageCode}</div>
          <div><strong>Премиум:</strong> {user.isPremium ? "Да" : "Нет"}</div>
          <div><strong>Bot:</strong> {user.isBot ? "Да" : "Нет"}</div>
          <div><strong>ID:</strong> {user.id}</div>
        </div>
      </div>
    </Page>
  );
};
