import { Helmet } from 'react-helmet-async';
import { StartWindow } from '../../components/StartWindow/StartWindow';

const containerStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--dark-blue)',
  position: 'relative',
};

export default function StartPage(): JSX.Element {
  return (
    <div style={containerStyle}>
      <Helmet>
        <title>Start</title>
      </Helmet>
      <StartWindow />
    </div>
  );
}
