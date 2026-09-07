import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { Layout } from '@/components/Layout';
import Home from '@/pages/Home';
import Films from '@/pages/Films';
import FilmDetails from '@/pages/FilmDetails';
import Reviews from '@/pages/Reviews';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/films" element={<Films />} />
          <Route path="/films/:id" element={<FilmDetails />} />
          <Route path="/reviews" element={<Reviews />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AuthProvider>
  );
}
