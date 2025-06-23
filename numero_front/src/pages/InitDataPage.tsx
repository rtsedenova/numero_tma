import { type FC, useMemo } from 'react';
import { initData, useSignal } from '@telegram-apps/sdk-react';
import { Placeholder } from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import { DataSection } from '@/components/DataSection/DataSection';
import { getUserRows, getChatRows } from '@/helpers/userDataHelpers';
import { type DisplayDataRow } from '@/components/DisplayData/DisplayData';

export const InitDataPage: FC = () => {
  const initDataRaw = useSignal(initData.raw);
  const initDataState = useSignal(initData.state);

  const initDataRows = useMemo<DisplayDataRow[] | undefined>(() => {
    if (!initDataState || !initDataRaw) {
      return;
    }
    const {
      authDate,
      hash,
      queryId,
      chatType,
      chatInstance,
      canSendAfter,
      startParam,
    } = initDataState;
    return [
      { title: 'raw', value: initDataRaw },
      { title: 'auth_date', value: authDate.toLocaleString() },
      { title: 'auth_date (raw)', value: authDate.getTime() / 1000 },
      { title: 'hash', value: hash },
      { title: 'can_send_after', value: initData.canSendAfterDate()?.toISOString() },
      { title: 'can_send_after (raw)', value: canSendAfter },
      { title: 'query_id', value: queryId },
      { title: 'start_param', value: startParam },
      { title: 'chat_type', value: chatType },
      { title: 'chat_instance', value: chatInstance },
    ];
  }, [initDataState, initDataRaw]);

  const userRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initDataState?.user ? getUserRows(initDataState.user) : undefined;
  }, [initDataState]);

  const receiverRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initDataState?.receiver ? getUserRows(initDataState.receiver) : undefined;
  }, [initDataState]);

  const chatRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initDataState?.chat ? getChatRows(initDataState.chat) : undefined;
  }, [initDataState]);

  if (!initDataRows) {
    return (
      <Page>
        <Placeholder
          header="Oops"
          description="Application was launched with missing init data"
        >
          <img
            alt="Telegram sticker"
            src="https://xelene.me/telegram.gif"
            style={{ display: 'block', width: '144px', height: '144px' }}
          />
        </Placeholder>
      </Page>
    );
  }

  return (
    <Page>
      <DataSection header="Init Data" rows={initDataRows} />
      <DataSection header="User" rows={userRows} />
      <DataSection header="Receiver" rows={receiverRows} />
      <DataSection header="Chat" rows={chatRows} />
    </Page>
  );
};
