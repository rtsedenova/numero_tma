import { FC } from "react";
import { Page } from "@/components/Page";
import { useSignal } from "@telegram-apps/sdk-react";
import { initData } from "@telegram-apps/sdk-react";
import { openTelegramLink } from '@telegram-apps/sdk-react';

import { Megaphone } from "phosphor-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CurrencyChip } from "@/components/CurrencyChip";
import { Avatar } from "@/components/Avatar";
import { usePredictionAttempts } from "@/storage/predictionAttempts";

export const ProfilePage: FC = () => {
  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;

  const { credits, isLoading: isPredictionsLoading } = usePredictionAttempts();

  const handleShare = () => {
    const url = 'https://t.me/NumeroSeer_bot'; 
    const text = 'Привет, Друг! Я использую Numero ✨';

    const shareUrl =
      `https://t.me/share/url?` +
      `url=${encodeURIComponent(url)}` +
      `&text=${encodeURIComponent(text)}`;

    openTelegramLink(shareUrl);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] p-6 box-border">
        <p>Данные пользователя не найдены.</p>
      </div>
    );
  }

  return (
    <Page>
      <div className="page min-h-screen bg-[var(--bg)] box-border">
        <div className="flex items-center justify-end mb-4">
          <ThemeToggle />
        </div>

        <div className="flex flex-col items-center">
          <Avatar
            src={user.photoUrl}
            alt={`${user.firstName} ${user.lastName} avatar`}
            size={120}
            mode="profile-page"
          />

          <div className="flex flex-col items-center font-[var(--font-info)]">
            <div className="text-2xl font-semibold text-[var(--text)] text-center">
              {user.firstName} {user.lastName}
            </div>

            {user.username && (
              <div className="text-base text-[var(--text-subtle)] text-center mb-4">
                @{user.username}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mb-4 text-[var(--text)]">
          <CurrencyChip
            value={credits !== null ? String(credits) : "0"}
            isLoading={isPredictionsLoading || credits === null}
          />
        </div>

        <div className="mt-8">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2
            rounded-lg px-4 py-2 text-sm font-medium
            bg-[var(--button-bg)] text-[var(--button-text)]
            hover:bg-[var(--button-bg-hover)]"
        >
          <Megaphone
            weight="bold"
            className="h-4 w-4 shrink-0 -scale-x-100 [filter:var(--icon-shadow)]"
            aria-hidden="true"
          />
          Пригласить друзей
        </button>
        </div>
      </div>
    </Page>
  );
};
