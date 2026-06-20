<template>
  <div class="not-found-container">
    <div class="not-found-wrapper">
      <div class="error-code">404</div>
      <div class="error-message">页面不存在</div>
      <div class="error-description">
        抱歉，您访问的页面不存在或已被移动。
      </div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          <i class="el-icon-home" /> 返回首页
        </el-button>
        <el-button @click="goBack">
          <i class="el-icon-back" /> 返回上页
        </el-button>
      </div>
      <div class="error-illustration">
        <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="50" y="50" width="200" height="100" rx="8" fill="#f5f7fa" stroke="#e4e7ed" stroke-width="2"/>
          <path d="M100 80 L200 80 M150 80 L150 120 M120 120 L180 120" stroke="#909399" stroke-width="2" stroke-linecap="round"/>
          <circle cx="120" cy="150" r="12" fill="#67c23a"/>
          <circle cx="180" cy="150" r="12" fill="#67c23a"/>
          <path d="M70 70 C70 50 90 50 100 60" stroke="#409eff" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M230 70 C230 50 210 50 200 60" stroke="#409eff" stroke-width="3" fill="none" stroke-linecap="round"/>
          <text x="150" y="40" text-anchor="middle" font-family="monospace" font-size="20" fill="#909399">404</text>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push('/');
    ElMessage.info('已经是第一页了，返回首页');
  }
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.not-found-wrapper {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #409eff;
  margin: 0 0 20px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

.error-message {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 15px 0;
}

.error-description {
  font-size: 16px;
  color: #909399;
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
}

.error-illustration {
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@media (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }
  
  .error-message {
    font-size: 24px;
  }
  
  .error-description {
    font-size: 14px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-illustration svg {
    width: 250px;
    height: 160px;
  }
}
</style>