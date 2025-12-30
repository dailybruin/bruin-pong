import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Game } from './components/Game';


function App() {
  return (
    <div className="App">
      <h1>BRUIN PONG</h1>
      <Game />
    </div>
  );
}

export default App
