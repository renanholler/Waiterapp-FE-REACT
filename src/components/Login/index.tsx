import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../../utils/auth';
import { Button, Container, Input } from './styles';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (isTokenValid(token)) {
      navigate('/orders');
    }
  }, [token, navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, { email, senha });
      localStorage.setItem('token', response.data.token);
      navigate('/orders');
    } catch (error) {
      alert('Credenciais inválidas');
    }
  };

  return (
    <Container>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <Button onClick={handleLogin}>Entrar</Button>
    </Container>
  );
};

export default Login;
