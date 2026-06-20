import request from '../utils/request';

/**
 * 获取产品列表
 * @param {Object} params - 分页参数
 * @returns {Promise<Object>} 产品列表
 */
export const getProductList = async (params) => {
  const response = await request.get('/products', params);
  return response.data;
};

/**
 * 获取产品详情
 * @param {number} id - 产品ID
 * @returns {Promise<Object>} 产品详情
 */
export const getProductDetail = async (id) => {
  const response = await request.get(`/products/${id}`);
  return response.data;
};

/**
 * 创建产品
 * @param {Object} data - 产品数据
 * @returns {Promise<Object>} 创建后的产品
 */
export const createProduct = async (data) => {
  const response = await request.post('/products', data);
  return response.data;
};

/**
 * 更新产品
 * @param {number} id - 产品ID
 * @param {Object} data - 产品数据
 * @returns {Promise<Object>} 更新后的产品
 */
export const updateProduct = async (id, data) => {
  const response = await request.put(`/products/${id}`, data);
  return response.data;
};

/**
 * 删除产品
 * @param {number} id - 产品ID
 * @returns {Promise<void>}
 */
export const deleteProduct = async (id) => {
  await request.delete(`/products/${id}`);
};

/**
 * 批量删除产品
 * @param {number[]} ids - 产品ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteProducts = async (ids) => {
  await request.delete('/products/batch', { ids });
};

/**
 * 更新产品状态
 * @param {number} id - 产品ID
 * @param {string} status - 产品状态
 * @returns {Promise<Object>} 更新后的产品
 */
export const updateProductStatus = async (id, status) => {
  const response = await request.put(`/products/${id}/status`, { status });
  return response.data;
};

/**
 * 获取产品分类
 * @returns {Promise<Array<Object>>} 产品分类列表
 */
export const getProductCategories = async () => {
  const response = await request.get('/products/categories');
  return response.data;
};

/**
 * 导出产品数据
 * @param {Object} params - 查询参数
 * @returns {Promise<Blob>} 导出的文件
 */
export const exportProducts = async (params) => {
  const response = await request.get('/products/export', params, {
    responseType: 'blob'
  });
  return response.data;
};