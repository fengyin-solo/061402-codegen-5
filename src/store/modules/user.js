import { defineStore } from 'pinia';
import * as userApi from '../../api/user';

export default defineStore('user', {
  state: () => ({
    userList: [],
    currentUser: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    },
    loading: false,
    error: null
  }),

  getters: {
    getUserById: (state) => (id) => {
      return state.userList.find(user => user.id === id);
    },
    getPaginatedUsers: (state) => {
      const startIndex = (state.pagination.page - 1) * state.pagination.pageSize;
      const endIndex = startIndex + state.pagination.pageSize;
      return state.userList.slice(startIndex, endIndex);
    }
  },

  actions: {
    async fetchUserList(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const result = await userApi.getUserList({
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          ...params
        });
        this.userList = result.data;
        this.pagination = {
          ...this.pagination,
          total: result.total,
          totalPages: result.totalPages
        };
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch user list:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchUserDetail(id) {
      this.loading = true;
      this.error = null;
      try {
        const user = await userApi.getUserDetail(id);
        this.currentUser = user;
        return user;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch user detail:', error);
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData) {
      this.loading = true;
      this.error = null;
      try {
        const user = await userApi.createUser(userData);
        this.userList.unshift(user);
        this.pagination.total += 1;
        return user;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to create user:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id, userData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedUser = await userApi.updateUser(id, userData);
        const index = this.userList.findIndex(user => user.id === id);
        if (index !== -1) {
          this.userList[index] = updatedUser;
        }
        if (this.currentUser && this.currentUser.id === id) {
          this.currentUser = updatedUser;
        }
        return updatedUser;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to update user:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id) {
      this.loading = true;
      this.error = null;
      try {
        await userApi.deleteUser(id);
        this.userList = this.userList.filter(user => user.id !== id);
        this.pagination.total -= 1;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to delete user:', error);
      } finally {
        this.loading = false;
      }
    },

    async batchDeleteUser(ids) {
      this.loading = true;
      this.error = null;
      try {
        await userApi.batchDeleteUsers(ids);
        this.userList = this.userList.filter(user => !ids.includes(user.id));
        this.pagination.total -= ids.length;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to batch delete users:', error);
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