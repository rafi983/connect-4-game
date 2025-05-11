import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

test('renders start page with Play vs CPU and Play vs Player buttons', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  const vsCpuButton = await screen.findByText('PLAY VS CPU');
  const vsPlayerButton = await screen.findByText('PLAY VS PLAYER');
  expect(vsCpuButton).toBeInTheDocument();
  expect(vsPlayerButton).toBeInTheDocument();
});

test('renders game page with Menu and Restart buttons', async () => {
  render(
    <MemoryRouter initialEntries={['/game']}>
      <App />
    </MemoryRouter>
  );

  const menuButton = await screen.findByRole('button', { name: 'MENU' });
  expect(menuButton).toBeInTheDocument();

  const restartButtons = await screen.findAllByRole('button', {
    name: 'RESTART',
  });
  const gameHeaderRestartButton = restartButtons.find(button =>
    button.className.includes('gameHeader__button')
  );
  expect(gameHeaderRestartButton).toBeInTheDocument();
});
