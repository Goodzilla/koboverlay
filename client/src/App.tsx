import React from 'react';
import { Dashboard } from './pages/Dashboard';
import { Overlay } from './pages/Overlay';

export const App: React.FC = () => {
  const isOverlayPath = window.location.pathname.startsWith('/overlay');

  if (isOverlayPath) {
    return <Overlay />;
  }

  return <Dashboard />;
};

export default App;
