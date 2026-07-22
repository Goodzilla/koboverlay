import React from 'react';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Overlay } from './pages/Overlay';

export const App: React.FC = () => {
  const path = window.location.pathname;

  if (path.startsWith('/overlay')) {
    return <Overlay />;
  }

  if (path.startsWith('/studio')) {
    return <Dashboard />;
  }

  return <Landing />;
};

export default App;
