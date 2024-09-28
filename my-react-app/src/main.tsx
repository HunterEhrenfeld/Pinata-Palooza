import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome.tsx';
import JoinLobby from './components/JoinLobby.tsx';
import Game from './components/Game.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<Welcome />} />
        <Route path='/join' element={<JoinLobby />} />
        <Route path='/play' element={<Game />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
