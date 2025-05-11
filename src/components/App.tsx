import { lazy, createContext, useState, Dispatch, SetStateAction } from 'react';
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
  const [playerVsPlayer, setPlayerVsPlayer] = useState(false);

  return (
    <GameContext.Provider value={{ playerVsPlayer, setPlayerVsPlayer }}>
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
