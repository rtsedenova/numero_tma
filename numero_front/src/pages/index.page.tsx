import { FC } from "react";
import { Page } from "@/components/Page";
import { useTelegramUser } from "@/hooks/useTelegramUser";
import { HandEye, Infinity } from "phosphor-react";
import { AccountHeader } from "@/components/AccountHeader";
import NavCard from "@/components/NavCard";

export const IndexPage: FC = () => {
  const { user } = useTelegramUser();

  return (
    <Page back={false}>
      <div className="page index-page">
        <div className="mb-8">
          <AccountHeader user={user} />
        </div>

        <section className="index-page__cards grid gap-4 grid-cols-1 md:grid-cols-2">
          <NavCard
            title="Нумерология"
            subtitle="Число укажет ваш путь"
            description="Рассчитайте ключевое число и получите краткое толкование по датe."
            link="/numerology-new"
            icon={<Infinity weight="regular" />}
            className="navcard--numerology"
          />

          <NavCard
            title="Таро"
            subtitle="Путь и выбор"
            description="Меньше тумана — больше решений. Таро по делу."
            link="/tarot"
            icon={<HandEye weight="regular" />}
            className="navcard--tarot"
          />
        </section>
      </div>
    </Page>
  );
};
