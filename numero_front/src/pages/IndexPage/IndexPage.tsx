import { FC } from "react";
import { Page } from "@/components/Page";
import { useNavigate } from "react-router-dom";
import { useTelegramUser } from "@/hooks/useTelegramUser";
import { useSendInitData } from "@/hooks/useSendInitData"; 
import "@/styles/pages/index-page.scss";

export const IndexPage: FC = () => {
  const navigate = useNavigate();
  const { user } = useTelegramUser();
  useSendInitData(); 

  const handleProfileClick = () => navigate("/profile");
  const handleDestinyClick = () => navigate("/calculate-destiny-number");

  return (
    <Page back={false}>
      <div className="index-page">
        <header className="index-page__header" onClick={handleProfileClick}>
          {user?.photoUrl && (
            <img src={user.photoUrl} alt="Аватар" className="index-page__avatar" />
          )}
          <div className="index-page__username">
            {user?.firstName} {user?.lastName} {user?.username && `(@${user.username})`}
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
