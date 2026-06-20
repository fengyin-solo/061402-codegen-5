import { defineStore } from 'pinia';
import * as productApi from '../../api/product';

export default defineStore('product', {
  state: () => ({
    productList: [],
    currentProduct: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    },
    categories: [],
    loading: false,
    error: null
  }),

  getters: {
    getProductById: (state) => (id) => {
      return state.productList.find(product => product.id === id);
    },
    getPaginatedProducts: (state) => {
      const startIndex = (state.pagination.page - 1) * state.pagination.pageSize;
      const endIndex = startIndex + state.pagination.pageSize;
      return state.productList.slice(startIndex, endIndex);
    },
    getActiveProducts: (state) => {
      return state.productList.filter(product => product.status === 'active');
    }
  },

  actions: {
    async fetchProductList(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const result = await productApi.getProductList({
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          ...params
        });
        this.productList = result.data;
        this.pagination = {
          ...this.pagination,
          total: result.total,
          totalPages: result.totalPages
        };
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch product list:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchProductDetail(id) {
      this.loading = true;
      this.error = null;
      try {
        const product = await productApi.getProductDetail(id);
        this.currentProduct = product;
        return product;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch product detail:', error);
      } finally {
        this.loading = false;
      }
    },

    async createProduct(productData) {
      this.loading = true;
      this.error = null;
      try {
        const product = await productApi.createProduct(productData);
        this.productList.unshift(product);
        this.pagination.total += 1;
        return product;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to create product:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(id, productData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedProduct = await productApi.updateProduct(id, productData);
        const index = this.productList.findIndex(product => product.id === id);
        if (index !== -1) {
          this.productList[index] = updatedProduct;
        }
        if (this.currentProduct && this.currentProduct.id === id) {
          this.currentProduct = updatedProduct;
        }
        return updatedProduct;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to update product:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(id) {
      this.loading = true;
      this.error = null;
      try {
        await productApi.deleteProduct(id);
        this.productList = this.productList.filter(product => product.id !== id);
        this.pagination.total -= 1;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to delete product:', error);
      } finally {
        this.loading = false;
      }
    },

    async batchDeleteProduct(ids) {
      this.loading = true;
      this.error = null;
      try {
        await productApi.batchDeleteProducts(ids);
        this.productList = this.productList.filter(product => !ids.includes(product.id));
        this.pagination.total -= ids.length;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to batch delete products:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const categories = await productApi.getProductCategories();
        this.categories = categories;
        return categories;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch categories:', error);
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