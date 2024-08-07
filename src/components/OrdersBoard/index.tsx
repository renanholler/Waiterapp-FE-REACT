import { useState } from 'react';
import { toast } from 'react-toastify';
import { Order } from '../../types/Order';
import api from '../../utils/api';
import { OrderModal } from '../OrderModal';
import { Board, OrdersContainer } from './styles';

interface OrdersBoardProps {
  icon: string;
  title: string;
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
  onChangeOrderStatus: (orderId: string, status: Order['status']) => void;
}

export function OrdersBoard({ icon, title, orders, onCancelOrder, onChangeOrderStatus }: OrdersBoardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<null | Order>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleOpenModal(order: Order) {
    setIsModalVisible(true);
    setSelectedOrder(order);
  }

  function handleCloseModal() {
    setIsModalVisible(false);
    setSelectedOrder(null);
  }

  async function handleChangeOrderStatus() {
    console.log('Iniciando alteração de status da ordem...');
    setIsLoading(true);
    try {
      const status = selectedOrder?.status === 'WAITING'
        ? 'IN_PRODUCTION'
        : 'DONE';

      await api.patch(`/orders/${selectedOrder?._id}`, { status });
      toast.success(`O pedido da mesa ${selectedOrder?.table} teve o status alterado!`);
      console.log('Status alterado, atualizando estado...');
      onChangeOrderStatus(selectedOrder!._id, status);
    } catch (error) {
      console.error('Erro ao alterar o status da ordem:', error);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  }

  async function handleCancelOrder() {
    console.log('Iniciando cancelamento da ordem...');
    setIsLoading(true);
    try {
      const response = await api.delete(`/orders/${selectedOrder?._id}`);
      console.log('Resposta da API:', response);
      toast.success(`O pedido da mesa ${selectedOrder?.table} foi cancelado!`);
      console.log('Ordem cancelada, atualizando estado...');
      onCancelOrder(selectedOrder!._id);
    } catch (error) {
      console.error('Erro ao cancelar a ordem:', error);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  }

  return <Board>
    <OrderModal
      visible={isModalVisible}
      order = {selectedOrder}
      onClose = {handleCloseModal}
      onCancelOrder={handleCancelOrder}
      onChangeOrderStatus={handleChangeOrderStatus}
      isLoading={isLoading}
    />
    <header>
      <span>{icon}</span>
      <strong>{title}</strong>
      <span>( {orders.length} )</span>
    </header>
    {orders.length > 0 && (
      <OrdersContainer>
        {orders.map((order) => (
          <button type='button' key={order._id} onClick={() => handleOpenModal(order)}>
            <strong>Mesa {order.table}</strong>
            <span>{order.products.length} itens</span>
          </button>
        ))}
      </OrdersContainer>
    )}
  </Board>;
}
