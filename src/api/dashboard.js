import request from '../utils/request';

/**
 * 获取仪表盘统计数据
 * @returns {Promise<Object>} 统计数据
 */
export const getDashboardStats = async () => {
  const response = await request.get('/dashboard/stats');
  return response.data;
};

/**
 * 获取最近订单
 * @param {number} limit - 数量限制
 * @returns {Promise<Array<Object>>} 最近订单
 */
export const getRecentOrders = async (limit = 5) => {
  const response = await request.get('/dashboard/recent-orders', { limit });
  return response.data;
};

/**
 * 获取热门产品
 * @param {number} limit - 数量限制
 * @returns {Promise<Array<Object>>} 热门产品
 */
export const getTopProducts = async (limit = 5) => {
  const response = await request.get('/dashboard/top-products', { limit });
  return response.data;
};

/**
 * 获取销售趋势
 * @param {string} period - 时间周期 (day, week, month, year)
 * @returns {Promise<Array<Object>>} 销售趋势数据
 */
export const getSalesTrend = async (period = 'month') => {
  const response = await request.get('/dashboard/sales-trend', { period });
  return response.data;
};

/**
 * 获取用户增长趋势
 * @param {string} period - 时间周期 (day, week, month, year)
 * @returns {Promise<Array<Object>>} 用户增长数据
 */
export const getUserGrowth = async (period = 'month') => {
  const response = await request.get('/dashboard/user-growth', { period });
  return response.data;
};