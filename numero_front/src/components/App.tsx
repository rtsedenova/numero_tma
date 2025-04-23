import { useLaunchParams, miniApp, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';

import { useSendInitData } from '@/hooks/useSendInitData';

import { routes } from '@/navigation/routes.tsx';

import { BottomNavbar } from './Navbar/Navbar';

export function App() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);

  useSendInitData();

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <HashRouter>
        <BottomNavbar/>
        <Routes>
          {routes.map((route) => <Route key={route.path} {...route} />)}
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </HashRouter>
    </AppRoot>
  );
}
