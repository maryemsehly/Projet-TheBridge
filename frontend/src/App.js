import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminInterface from './components/AdminInterface';
import AdminLogin from './components/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path='/admin' element={<AdminInterface />} />
      </Routes>
    </Router>
  );
}

export default App;
