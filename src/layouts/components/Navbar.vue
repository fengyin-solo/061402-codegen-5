<template>
  <div class="navbar-wrapper">
    <div class="navbar-container">
      <!-- 侧边栏切换按钮 -->
      <div class="navbar-left">
        <el-button
          type="text"
          icon="el-icon-menu"
          @click="toggleSidebar"
          class="sidebar-toggle-btn"
        />
      </div>
      
      <!-- 面包屑 -->
      <div class="navbar-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumbList"
            :key="item.path"
            :to="{ path: item.path || '/' }"
          >
            {{ item.meta.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      
      <!-- 右侧工具栏 -->
      <div class="navbar-right">
        <el-dropdown @command="handleCommand">
          <el-button type="text" class="navbar-btn">
            <i class="el-icon-setting" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="theme">
                <i class="el-icon-sunny" /> 主题切换
              </el-dropdown-item>
              <el-dropdown-item command="language">
                <i class="el-icon-s-tools" /> 语言设置
              </el-dropdown-item>
              <el-dropdown-item command="fullscreen">
                <i class="el-icon-rank" /> 全屏
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <i class="el-icon-user" /> 退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <!-- 用户头像 -->
        <el-dropdown>
          <div class="user-info">
            <el-avatar :size="32" class="user-avatar">
              {{ userInfo.name?.charAt(0) || 'U' }}
            </el-avatar>
            <span class="user-name" v-if="!isMobile">{{ userInfo.name }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <i class="el-icon-user" /> 个人中心
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <i class="el-icon-setting" /> 账号设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <i class="el-icon-switch-button" /> 退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '../../store';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const isMobile = computed(() => appStore.device === 'mobile');
const userInfo = ref({
  name: '管理员',
  avatar: ''
});

const toggleSidebar = () => {
  appStore.toggleSidebar();
};

const breadcrumbList = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title);
  return matched;
});

const handleCommand = (command) => {
  switch (command) {
    case 'theme':
      toggleTheme();
      break;
    case 'language':
      toggleLanguage();
      break;
    case 'fullscreen':
      toggleFullscreen();
      break;
    case 'logout':
      logout();
      break;
    case 'profile':
      router.push('/profile');
      break;
    case 'settings':
      router.push('/account-settings');
      break;
  }
};

const toggleTheme = () => {
  const newTheme = appStore.theme === 'light' ? 'dark' : 'light';
  appStore.setTheme(newTheme);
};

const toggleLanguage = () => {
  const newLang = appStore.language === 'zh-CN' ? 'en-US' : 'zh-CN';
  appStore.setLanguage(newLang);
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error('全屏模式失败:', err);
    });
  } else {
    document.exitFullscreen();
  }
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>

<style scoped>
.navbar-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 210px;
  z-index: 1000;
  transition: left 0.28s;
}

:not(.sidebar-opened) .navbar-wrapper {
  left: 54px;
}

.device-mobile .navbar-wrapper {
  left: 0;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-left {
  flex: 0 0 auto;
}

.sidebar-toggle-btn {
  font-size: 18px;
  color: #666;
}

.navbar-breadcrumb {
  flex: 1;
  margin: 0 20px;
}

.navbar-right {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

.navbar-btn {
  margin-left: 10px;
  font-size: 18px;
  color: #666;
}

.user-info {
  display: flex;
  align-items: center;
  margin-left: 15px;
  padding: 0 10px;
  cursor: pointer;
}

.user-avatar {
  margin-right: 8px;
}

.user-name {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .navbar-breadcrumb {
    display: none;
  }
  
  .user-name {
    display: none;
  }
}
</style>