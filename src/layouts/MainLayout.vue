<template>
  <div class="app-wrapper" :class="{ 'has-sidebar': true, 'sidebar-opened': sidebarOpened, 'device-mobile': device === 'mobile' }">
    <!-- 侧边栏 -->
    <sidebar v-if="settings.sidebarLogo" />
    
    <!-- 主内容区域 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <navbar />
      
      <!-- 标签页 -->
      <tags-view v-if="settings.tagsView" />
      
      <!-- 页面内容 -->
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '../store';
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';
import TagsView from './components/TagsView.vue';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const sidebarOpened = computed(() => appStore.getSidebarStatus);
const device = computed(() => appStore.getDevice);
const settings = computed(() => appStore.getSettings);
const cachedViews = computed(() => appStore.getCachedViews);

// 监听路由变化，添加访问记录
router.afterEach((to) => {
  appStore.addView(to);
});
</script>

<style scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  min-height: 100vh;
}

.main-container {
  transition: margin-left 0.28s;
  margin-left: 210px;
  height: 100%;
}

.sidebar-opened .main-container {
  margin-left: 210px;
}

:not(.sidebar-opened) .main-container {
  margin-left: 54px;
}

.device-mobile .main-container {
  margin-left: 0;
}

.app-main {
  min-height: calc(100vh - 130px);
  padding: 20px;
  background-color: #f5f7fa;
}

@media (max-width: 768px) {
  .app-main {
    padding: 10px;
  }
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>