import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas - IMPORTANTE: nota el './pages/'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

// Estilos - IMPORTANTE: nota el './styles/'
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;