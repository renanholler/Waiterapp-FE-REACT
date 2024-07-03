import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socketIo from 'socket.io-client';
import { Order } from '../../types/Order';
import api from '../../utils/api';
import { isTokenValid } from '../../utils/auth';
import { OrdersBoard } from '../OrdersBoard';
import { Container } from './styles';

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!isTokenValid(token)) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const socket = socketIo(`${import.meta.env.VITE_BASE_URL}`, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket conectado!');
    });

    socket.on('orders@new', (order) => {
      setOrders(prevState => prevState.concat(order));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => {
        setOrders(data);
      });
  }, []);

  const waiting = orders.filter((order) => order.status === 'WAITING');
  const inProduction = orders.filter((order) => order.status === 'IN_PRODUCTION');
  const done = orders.filter((order) => order.status === 'DONE');

  function handleCancelOrder(orderId: string) {
    console.log('Cancelando ordem:', orderId);
    setOrders((prevState) => {
      const updatedOrders = prevState.filter(order => order._id !== orderId);
      console.log('Ordens atualizadas:', updatedOrders);
      return updatedOrders;
    });
  }

  function handleOrderStatusChange(orderId: string, status: Order['status']) {
    console.log('Alterando status da ordem:', orderId, status);
    setOrders((prevState) => {
      const updatedOrders = prevState.map((order) => (
        order._id === orderId
          ? { ...order, status }
          : order
      ));
      console.log('Ordens atualizadas:', updatedOrders);
      return updatedOrders;
    });
  }

  return (
    <Container>
      <OrdersBoard
        icon="🕒"
        title="Fila de espera"
        orders={waiting}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />
      <OrdersBoard
        icon="👨‍🍳"
        title="Em preparação"
        orders={inProduction}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />
      <OrdersBoard
        icon="✅"
        title="Pronto!"
        orders={done}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />
    </Container>
  );
}
