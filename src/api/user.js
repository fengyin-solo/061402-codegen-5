import request from '../utils/request';

/**
 * 获取用户列表
 * @param {PaginationParams} params - 分页参数
 * @returns {Promise<PaginationResult<User>>} 用户列表
 */
export const getUserList = async (params) => {
  const response = await request.get('/users', params);
  return response.data;
};

/**
 * 获取用户详情
 * @param {number} id - 用户ID
 * @returns {Promise<User>} 用户详情
 */
export const getUserDetail = async (id) => {
  const response = await request.get(`/users/${id}`);
  return response.data;
};

/**
 * 创建用户
 * @param {User} data - 用户数据
 * @returns {Promise<User>} 创建后的用户
 */
export const createUser = async (data) => {
  const response = await request.post('/users', data);
  return response.data;
};

/**
 * 更新用户
 * @param {number} id - 用户ID
 * @param {User} data - 用户数据
 * @returns {Promise<User>} 更新后的用户
 */
export const updateUser = async (id, data) => {
  const response = await request.put(`/users/${id}`, data);
  return response.data;
};

/**
 * 删除用户
 * @param {number} id - 用户ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  await request.delete(`/users/${id}`);
};

/**
 * 批量删除用户
 * @param {number[]} ids - 用户ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteUsers = async (ids) => {
  await request.delete('/users/batch', { ids });
};

/**
 * 更新用户状态
 * @param {number} id - 用户ID
 * @param {string} status - 用户状态
 * @returns {Promise<User>} 更新后的用户
 */
export const updateUserStatus = async (id, status) => {
  const response = await request.put(`/users/${id}/status`, { status });
  return response.data;
};

/**
 * 获取用户角色选项
 * @returns {Promise<Array<{label: string, value: string}>>} 角色选项
 */
export const getUserRoles = async () => {
  const response = await request.get('/users/roles');
  return response.data;
};