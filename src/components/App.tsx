import { Dispatch, SetStateAction, createContext, lazy, useMemo, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './Layout/Layout';

const StartPage = lazy(() => import('../pages/StartPage/StartPage'));
const GamePage = lazy(() => import('../pages/GamePage/GamePage'));

export const GameContext = createContext({
  playerVsPlayer: true,
  setPlayerVsPlayer: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

export const App = () => {
  const [playerVsPlayer, setPlayerVsPlayer] = useState<boolean>(false);
  const contextValue = useMemo(
    () => ({ playerVsPlayer, setPlayerVsPlayer }),
    [playerVsPlayer]
  );

  return (
    <GameContext.Provider value={contextValue}>
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<StartPage />} />
            <Route path="game" element={<GamePage />} />
            <Route path="*" element={<StartPage />} />
          </Route>
        </Routes>
      </HelmetProvider>
    </GameContext.Provider>
  );
};
