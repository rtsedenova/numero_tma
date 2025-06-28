import { FC } from "react";
import { Page } from "@/components/Page";
import { useNavigate } from "react-router-dom";
import { useTelegramUser } from "@/hooks/useTelegramUser";
import { ArrowRight } from "phosphor-react";

export const IndexPage: FC = () => {
  const navigate = useNavigate();
  const { user } = useTelegramUser();

  const handleProfileClick = () => navigate("/profile");
  const handleDestinyClick = () => navigate("/calculate-destiny-number");

  return (
    <Page back={false}>
      <div className="index-page">
        <header className="index-page__header">
          <div className="index-page__user" onClick={handleProfileClick}>
            {user?.photoUrl && (
              <img src={user.photoUrl} alt="Аватар" className="index-page__avatar" />
            )}
            <div className="index-page__greeting">
              <div className="index-page__welcome">Привет,</div>
              <div className="index-page__name">{user?.firstName} 👋</div>
            </div>
          </div>
        </header>

        <main className="index-page__main">
          <button className="index-page__button" onClick={handleDestinyClick}>
            🔮 Рассчитать число судьбы
          </button>

          <section className="index-page__cards">
            <div className="index-page__card" onClick={() => navigate("/destiny-number")}>
              <div className="index-page__card-title">Нумерология</div>
              <ArrowRight size={20} weight="bold" />
            </div>

            <div className="index-page__card" onClick={() => navigate("/tarot")}>
              <div className="index-page__card-title">Карты Таро</div>
              <ArrowRight size={20} weight="bold" />
            </div>

            <div className="index-page__card" onClick={() => navigate("/runes")}>
              <div className="index-page__card-title">Руны</div>
              <ArrowRight size={20} weight="bold" />
            </div>
          </section>
        </main>
      </div>
    </Page>
  );
};
