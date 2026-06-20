<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-header">
        <h1>后台管理系统</h1>
        <p>欢迎登录，请输入您的账号信息</p>
      </div>
      
      <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item prop="captcha" v-if="showCaptcha">
          <div class="captcha-wrapper">
            <el-input
              v-model="form.captcha"
              placeholder="请输入验证码"
              prefix-icon="el-icon-s-data"
              size="large"
              @keyup.enter="handleLogin"
            />
            <img :src="captchaUrl" alt="验证码" class="captcha-img" @click="refreshCaptcha" />
          </div>
        </el-form-item>
        
        <el-form-item>
          <div class="login-options">
            <el-checkbox v-model="form.rememberMe">记住密码</el-checkbox>
            <el-button type="text" class="forgot-password">忘记密码？</el-button>
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
            full-width
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-footer">
        <p>© 2024 后台管理系统. 保留所有权利.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();

const loading = ref(false);
const showCaptcha = ref(false);
const captchaUrl = ref('');

const form = reactive({
  username: '',
  password: '',
  captcha: '',
  rememberMe: false
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码长度为4个字符', trigger: 'blur' }
  ]
};

const handleLogin = async () => {
  const loginForm = ref(null);
  if (!loginForm.value) return;
  
  try {
    await loginForm.value.validate();
    
    loading.value = true;
    
    // 模拟登录请求
    setTimeout(() => {
      // 验证用户名和密码
      if (form.username === 'admin' && form.password === 'admin123') {
        // 保存登录状态
        localStorage.setItem('token', 'fake-token-' + Date.now());
        localStorage.setItem('userInfo', JSON.stringify({
          username: form.username,
          name: '管理员',
          role: 'admin'
        }));
        
        ElMessage.success('登录成功！');
        router.push('/');
      } else {
        ElMessage.error('用户名或密码错误，请重试');
        showCaptcha.value = true;
        refreshCaptcha();
      }
      
      loading.value = false;
    }, 1500);
  } catch (error) {
    console.error('登录验证失败:', error);
  }
};

const refreshCaptcha = () => {
  // 生成随机验证码
  captchaUrl.value = `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f5f7fa"/>
      <text x="20" y="28" font-family="monospace" font-size="20" fill="#666">
        ${Math.random().toString(36).substring(2, 6).toUpperCase()}
      </text>
    </svg>
  `)}`;
};

onMounted(() => {
  // 检查是否有记住的密码
  const savedUsername = localStorage.getItem('savedUsername');
  const savedPassword = localStorage.getItem('savedPassword');
  if (savedUsername && savedPassword) {
    form.username = savedUsername;
    form.password = savedPassword;
    form.rememberMe = true;
  }
});
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-wrapper {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.login-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.login-form {
  margin-bottom: 30px;
}

.captcha-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.captcha-img {
  width: 100px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  background: #f5f7fa;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  color: #409eff;
  font-size: 14px;
}

.login-btn {
  height: 48px;
  font-size: 16px;
  font-weight: bold;
}

.login-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.login-footer p {
  margin: 0;
  color: #909399;
  font-size: 12px;
}

@media (max-width: 768px) {
  .login-wrapper {
    padding: 30px 20px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
}
</style>