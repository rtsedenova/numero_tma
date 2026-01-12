import { useLaunchParams } from '@telegram-apps/sdk-react';
// import { useLaunchParams, miniApp, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import { useEffect } from 'react';

import { useSendInitData } from '@/hooks/useSendInitData';
import { useInitializePredictions } from '@/hooks/useInitializePredictions';

import { routes } from '@/navigation/routes.tsx';
import { useTheme } from '@/hooks/useTheme';

export function App() {
  const lp = useLaunchParams();
  // const isDark = useSignal(miniApp.isDark);
  const { theme } = useTheme();

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  useSendInitData();

  useInitializePredictions();

  return (
    <AppRoot
      // appearance={isDark ? 'dark' : 'light'}
      appearance={theme}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <HashRouter>
        <Routes>
          {routes.map((route) => <Route key={route.path} {...route} />)}
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </HashRouter>
    </AppRoot>
  );
}
