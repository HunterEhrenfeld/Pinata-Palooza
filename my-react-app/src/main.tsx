import './index.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome.tsx';
import JoinLobby from './components/JoinLobby.tsx';
import Game from './components/Game.tsx';
import BottomNav from './components/BottomNav.tsx';
import './index.css';
import Pinata from './components/Pinata.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path='/*' element={<Welcome />} />
      <Route path='/join' element={<JoinLobby />} />
      <Route path='/play' element={<Game />} />
      <Route path='/pinata' element={<Pinata />} />
      <Route path='/bottom' element={<BottomNav />} />
    </Routes>
  </BrowserRouter>
  // </StrictMode>
);
