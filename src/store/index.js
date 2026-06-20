import { createPinia } from 'pinia';
import useUserStore from './modules/user';
import useProductStore from './modules/product';
import useOrderStore from './modules/order';
import useAppStore from './modules/app';

const pinia = createPinia();

export {
  useUserStore,
  useProductStore,
  useOrderStore,
  useAppStore
};

export default pinia;