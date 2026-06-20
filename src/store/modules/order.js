import { defineStore } from 'pinia';
import * as orderApi from '../../api/order';

export default defineStore('order', {
  state: () => ({
    orderList: [],
    currentOrder: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    },
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      shippedOrders: 0
    },
    loading: false,
    error: null
  }),

  getters: {
    getOrderById: (state) => (id) => {
      return state.orderList.find(order => order.id === id);
    },
    getPaginatedOrders: (state) => {
      const startIndex = (state.pagination.page - 1) * state.pagination.pageSize;
      const endIndex = startIndex + state.pagination.pageSize;
      return state.orderList.slice(startIndex, endIndex);
    },
    getPendingOrders: (state) => {
      return state.orderList.filter(order => order.status === 'pending');
    },
    getTotalRevenue: (state) => {
      return state.orderList
        .filter(order => order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered')
        .reduce((total, order) => total + order.totalAmount, 0);
    }
  },

  actions: {
    async fetchOrderList(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const result = await orderApi.getOrderList({
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          ...params
        });
        this.orderList = result.data;
        this.pagination = {
          ...this.pagination,
          total: result.total,
          totalPages: result.totalPages
        };
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch order list:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchOrderDetail(id) {
      this.loading = true;
      this.error = null;
      try {
        const order = await orderApi.getOrderDetail(id);
        this.currentOrder = order;
        return order;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch order detail:', error);
      } finally {
        this.loading = false;
      }
    },

    async createOrder(orderData) {
      this.loading = true;
      this.error = null;
      try {
        const order = await orderApi.createOrder(orderData);
        this.orderList.unshift(order);
        this.pagination.total += 1;
        return order;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to create order:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateOrder(id, orderData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedOrder = await orderApi.updateOrder(id, orderData);
        const index = this.orderList.findIndex(order => order.id === id);
        if (index !== -1) {
          this.orderList[index] = updatedOrder;
        }
        if (this.currentOrder && this.currentOrder.id === id) {
          this.currentOrder = updatedOrder;
        }
        return updatedOrder;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to update order:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateOrderStatus(id, status) {
      this.loading = true;
      this.error = null;
      try {
        const updatedOrder = await orderApi.updateOrderStatus(id, status);
        const index = this.orderList.findIndex(order => order.id === id);
        if (index !== -1) {
          this.orderList[index] = updatedOrder;
        }
        if (this.currentOrder && this.currentOrder.id === id) {
          this.currentOrder = updatedOrder;
        }
        return updatedOrder;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to update order status:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteOrder(id) {
      this.loading = true;
      this.error = null;
      try {
        await orderApi.deleteOrder(id);
        this.orderList = this.orderList.filter(order => order.id !== id);
        this.pagination.total -= 1;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to delete order:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchStats(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const stats = await orderApi.getOrderStats(params);
        this.stats = stats;
        return stats;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch order stats:', error);
      } finally {
        this.loading = false;
      }
    },

    setPage(page) {
      this.pagination.page = page;
    },

    setPageSize(pageSize) {
      this.pagination.pageSize = pageSize;
      this.pagination.page = 1;
    },

    clearError() {
      this.error = null;
    }
  }
});