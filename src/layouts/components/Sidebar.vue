<template>
  <div class="sidebar-wrapper">
    <div class="sidebar-container">
      <!-- Logo -->
      <div class="logo-wrapper" v-if="settings.sidebarLogo">
        <router-link to="/" class="logo">
          <div class="logo-icon">
            <i class="el-icon-s-data" />
          </div>
          <h1 class="logo-title" v-show="sidebarOpened">管理系统</h1>
        </router-link>
      </div>
      
      <!-- 菜单 -->
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          :collapse="!sidebarOpened"
          :background-color="'#2f4050'"
          :text-color="'#a7b1c2'"
          :active-text-color="'#fff'"
          :unique-opened="true"
          mode="inline"
        >
          <el-menu-item
            v-for="route in filteredRoutes"
            :key="route.path"
            :index="route.path"
          >
            <template #title>
              <i :class="'el-icon-' + route.meta.icon" />
              <span>{{ route.meta.title }}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '../../store';
import router from '../../router';

const route = useRoute();
const routerInstance = useRouter();
const appStore = useAppStore();

const sidebarOpened = computed(() => appStore.getSidebarStatus);
const settings = computed(() => appStore.getSettings);

const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});

// 过滤路由，只显示非隐藏的路由
const filteredRoutes = computed(() => {
  return router.options.routes.filter(route => !route.meta?.hidden);
});

const toggleSidebar = () => {
  appStore.toggleSidebar();
};

// 监听窗口大小变化
const handleResize = () => {
  if (window.innerWidth < 992) {
    appStore.closeSidebar(true);
  } else {
    appStore.openSidebar(true);
  }
};

watch(
  () => route.path,
  () => {
    if (appStore.device === 'mobile' && appStore.sidebar.opened) {
      appStore.closeSidebar(false);
    }
  }
);

onMounted(() => {
  if (window.innerWidth < 992) {
    appStore.toggleDevice('mobile');
    appStore.closeSidebar(true);
  }
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.sidebar-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  width: 210px;
  overflow: hidden;
  transition: width 0.28s;
}

.sidebar-container {
  height: 100%;
  background-color: #2f4050;
  transition: width 0.28s;
}

:not(.sidebar-opened) .sidebar-wrapper {
  width: 54px;
}

:not(.sidebar-opened) .sidebar-container {
  width: 54px;
}

.logo-wrapper {
  height: 60px;
  line-height: 60px;
  padding: 0 15px;
  background-color: #1f2d3d;
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  color: #fff;
  text-decoration: none;
  width: 100%;
}

.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.logo-title {
  margin: 0 0 0 12px;
  font-size: 18px;
  font-weight: 600;
}

.scrollbar-wrapper {
  height: calc(100% - 60px);
}

.el-menu {
  border: none;
  background-color: transparent;
  height: 100%;
}

.el-menu-item {
  height: 50px;
  line-height: 50px;
  margin: 4px 0;
  border-radius: 4px;
  margin: 4px 12px;
}

.el-menu-item:hover {
  background-color: #1f2d3d !important;
}

.el-menu-item.is-active {
  background-color: #1f2d3d !important;
}

.el-menu-item i {
  margin-right: 10px;
}

@media (max-width: 768px) {
  .sidebar-wrapper {
    position: fixed;
    left: -210px;
    transition: left 0.3s;
  }
  
  .sidebar-opened .sidebar-wrapper {
    left: 0;
  }
}
</style>