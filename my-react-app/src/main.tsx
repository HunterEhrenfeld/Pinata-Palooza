import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome.tsx';
import ZoomLanding from './components/ZoomLanding.tsx';
import './index.css';
import JoinLobby from './components/JoinLobby.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<Welcome />} />
        <Route path='/zoom' element={<ZoomLanding />} />
        <Route path='/join' element={<JoinLobby />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
