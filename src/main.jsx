import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.jsx'
import HowToPlay from './pages/HowToPlay.jsx'
import GameOver from './pages/GameOver.jsx'
import Gameplay from './Gameplay.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/gameplay" element={<Gameplay />} />
        <Route path="/game-over" element={<GameOver />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)