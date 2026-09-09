import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Gameplay from './Gameplay.jsx'
import GameOver from './pages/GameOver.jsx'
import Home from './pages/Home.jsx'
import HowToPlay from './pages/HowToPlay.jsx'
import Victory from './pages/Victory.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/gameplay" element={<Gameplay />} />
        <Route path="/game-over" element={<GameOver />} />
        <Route path="/victory" element={<Victory />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
