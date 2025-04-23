import { useSignal } from "@telegram-apps/sdk-react";
import { initData } from "@telegram-apps/sdk-react";

export const useTelegramUser = () => {
  const state = useSignal(initData.state);

  return {
    user: state?.user,
    initDataRaw: useSignal(initData.raw),
  };
};
