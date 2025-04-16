import { FC } from "react";
import { Page } from "@/components/Page";
import { useNavigate } from "react-router-dom";
import { useSignal } from "@telegram-apps/sdk-react";
import { initData } from "@telegram-apps/sdk-react";
import "@/styles/pages/index-page.scss";

export const IndexPage: FC = () => {
  const navigate = useNavigate();

  const initDataState = useSignal(initData.state);

  const username = initDataState?.user?.username;
  const avatarUrl = initDataState?.user?.photoUrl;
  const firstName = initDataState?.user?.firstName;
  const lastName = initDataState?.user?.lastName;

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleDestinyClick = () => {
    navigate("/calculate-destiny-number");
  };

  return (
    <Page back={false}>
      <div className="index-page">
        <header className="index-page__header" onClick={handleProfileClick}>
          {avatarUrl && (
            <img src={avatarUrl} alt="Аватар" className="index-page__avatar" />
          )}
          <div className="index-page__username">
            {firstName} {lastName} (@{username})
          </div>
        </header>

        <main className="index-page__main">
          <button className="index-page__button" onClick={handleDestinyClick}>
            🔮 Число судьбы
          </button>
        </main>
      </div>
    </Page>
  );
};
