import { Helmet } from 'react-helmet-async';
import { Game } from '../../components/Game/Game';

const pageStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '100vh',
};

export default function GamePage(): JSX.Element {
  return (
    <div style={pageStyle}>
      <Helmet>
        <title>Game</title>
      </Helmet>
      <Game />
    </div>
  );
}
