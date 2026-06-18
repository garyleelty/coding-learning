import { HashRouter, Routes, Route } from 'react-router-dom';
import { WorldMap } from './pages/WorldMap';
import { Level } from './pages/Level';
import { Boss } from './pages/Boss';
import { Home } from './pages/Home';
import { Sandbox } from './pages/Sandbox';

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[#0a0a1a] text-gray-200">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/worlds" element={<WorldMap />} />
          <Route path="/worlds/:id" element={<WorldMap />} />
          <Route path="/worlds/:id/level/:n" element={<Level />} />
          <Route path="/worlds/:id/boss" element={<Boss />} />
          <Route path="/sandbox" element={<Sandbox />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
