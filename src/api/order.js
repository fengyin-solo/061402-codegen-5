import request from '../utils/request';

/**
 * 获取订单列表
 * @param {Object} params - 分页参数
 * @returns {Promise<Object>} 订单列表
 */
export const getOrderList = async (params) => {
  const response = await request.get('/orders', params);
  return response.data;
};

/**
 * 获取订单详情
 * @param {number} id - 订单ID
 * @returns {Promise<Object>} 订单详情
 */
export const getOrderDetail = async (id) => {
  const response = await request.get(`/orders/${id}`);
  return response.data;
};

/**
 * 创建订单
 * @param {Object} data - 订单数据
 * @returns {Promise<Object>} 创建后的订单
 */
export const createOrder = async (data) => {
  const response = await request.post('/orders', data);
  return response.data;
};

/**
 * 更新订单
 * @param {number} id - 订单ID
 * @param {Object} data - 订单数据
 * @returns {Promise<Object>} 更新后的订单
 */
export const updateOrder = async (id, data) => {
  const response = await request.put(`/orders/${id}`, data);
  return response.data;
};

/**
 * 删除订单
 * @param {number} id - 订单ID
 * @returns {Promise<void>}
 */
export const deleteOrder = async (id) => {
  await request.delete(`/orders/${id}`);
};

/**
 * 更新订单状态
 * @param {number} id - 订单ID
 * @param {string} status - 订单状态
 * @returns {Promise<Object>} 更新后的订单
 */
export const updateOrderStatus = async (id, status) => {
  const response = await request.put(`/orders/${id}/status`, { status });
  return response.data;
};

/**
 * 获取订单统计
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 统计数据
 */
export const getOrderStats = async (params) => {
  const response = await request.get('/orders/stats', params);
  return response.data;
};

/**
 * 获取订单状态选项
 * @returns {Promise<Array<Object>>} 状态选项
 */
export const getOrderStatusOptions = async () => {
  const response = await request.get('/orders/status-options');
  return response.data;
};

/**
 * 导出订单数据
 * @param {Object} params - 查询参数
 * @returns {Promise<Blob>} 导出的文件
 */
export const exportOrders = async (params) => {
  const response = await request.get('/orders/export', params, {
    responseType: 'blob'
  });
  return response.data;
};