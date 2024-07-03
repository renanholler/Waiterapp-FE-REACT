import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import Login from './components/Login';
import { Orders } from './components/Orders';
import PrivateRoute from './components/PrivateRoute';
import { GlobalStyles } from './styles/GlobalStyles';
import { isTokenValid } from './utils/auth';

export function App() {
  const token = localStorage.getItem('token');
  const isAuthenticated = isTokenValid(token);

  return (
    <Router>
      <GlobalStyles />
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/orders" /> : <Navigate to="/login" />}
        />
      </Routes>
      <ToastContainer position="bottom-center" />
    </Router>
  );
}
