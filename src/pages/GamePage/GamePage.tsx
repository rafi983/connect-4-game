import { Helmet } from 'react-helmet-async';
import { Game } from '../../components/Game/Game';

export default function GamePage() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Helmet>
        <title>Game</title>
      </Helmet>
      <Game />
    </div>
  );
}
