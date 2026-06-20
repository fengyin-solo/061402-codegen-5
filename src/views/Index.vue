<template>
  <div class="island-container">
    <div class="island-header">
      <h1>🏝️ 海岛生存</h1>
      <p>在荒岛上建立你的生存基地</p>
    </div>
    
    <div class="island-main">
      <div class="stats-panel">
        <div class="stat-card">
          <div class="stat-icon">🍖</div>
          <div class="stat-content">
            <div class="stat-number">{{ resources.food }}</div>
            <div class="stat-label">食物</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💧</div>
          <div class="stat-content">
            <div class="stat-number">{{ resources.water }}</div>
            <div class="stat-label">淡水</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🪵</div>
          <div class="stat-content">
            <div class="stat-number">{{ resources.wood }}</div>
            <div class="stat-label">木材</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⛏️</div>
          <div class="stat-content">
            <div class="stat-number">{{ resources.stone }}</div>
            <div class="stat-label">石头</div>
          </div>
        </div>
      </div>
      
      <div class="actions-panel">
        <h3>📋 可执行操作</h3>
        
        <div class="action-grid">
          <div class="action-card" @click="gatherFood">
            <div class="action-icon">🍓</div>
            <div class="action-title">采集食物</div>
            <div class="action-desc">在岛上寻找可食用的果实和动物</div>
            <div class="action-time">耗时: 30秒</div>
          </div>
          
          <div class="action-card" @click="collectWater">
            <div class="action-icon">💧</div>
            <div class="action-title">收集淡水</div>
            <div class="action-desc">收集雨水或净化海水</div>
            <div class="action-time">耗时: 1分钟</div>
          </div>
          
          <div class="action-card" @click="chopWood">
            <div class="action-icon">🪓</div>
            <div class="action-title">砍伐木材</div>
            <div class="action-desc">砍伐树木获取木材资源</div>
            <div class="action-time">耗时: 2分钟</div>
          </div>
          
          <div class="action-card" @click="mineStone">
            <div class="action-icon">⛏️</div>
            <div class="action-title">挖掘石头</div>
            <div class="action-desc">在岛上挖掘石头资源</div>
            <div class="action-time">耗时: 3分钟</div>
          </div>
          
          <div class="action-card" @click="buildShelter">
            <div class="action-icon">🏠</div>
            <div class="action-title">建造庇护所</div>
            <div class="action-desc">建造一个安全的住所</div>
            <div class="action-cost">需要: 50木材, 30石头</div>
          </div>
          
          <div class="action-card" @click="craftTools">
            <div class="action-icon">🔨</div>
            <div class="action-title">制作工具</div>
            <div class="action-desc">制作更高效的生存工具</div>
            <div class="action-cost">需要: 20木材, 10石头</div>
          </div>
        </div>
      </div>
      
      <div class="map-panel">
        <h3>🗺️ 海岛地图</h3>
        <div class="map-container">
          <div class="map-grid">
            <div v-for="(cell, index) in mapGrid" :key="index" 
                 :class="'map-cell ' + cell.type"
                 @click="exploreCell(index)">
              {{ cell.icon }}
            </div>
          </div>
          <div class="map-legend">
            <div class="legend-item">
              <span class="legend-icon">🌳</span>
              <span>森林</span>
            </div>
            <div class="legend-item">
              <span class="legend-icon">🏔️</span>
              <span>山地</span>
            </div>
            <div class="legend-item">
              <span class="legend-icon">🌊</span>
              <span>海洋</span>
            </div>
            <div class="legend-item">
              <span class="legend-icon">🏠</span>
              <span>营地</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="message-log">
      <h3>📜 生存日志</h3>
      <div class="log-list">
        <div v-for="(msg, index) in messageLog" :key="index" class="log-item">
          <span class="log-time">{{ msg.time }}</span>
          <span class="log-content">{{ msg.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const resources = ref({
  food: 100,
  water: 100,
  wood: 100,
  stone: 100
});

const messageLog = ref([
  { time: '00:00', content: '你来到了一个荒岛，开始你的生存之旅吧！' }
]);

const mapGrid = ref([
  { type: 'forest', icon: '🌳', explored: true },
  { type: 'forest', icon: '🌳', explored: true },
  { type: 'mountain', icon: '🏔️', explored: false },
  { type: 'ocean', icon: '🌊', explored: false },
  { type: 'camp', icon: '🏠', explored: true },
  { type: 'forest', icon: '🌳', explored: false },
  { type: 'ocean', icon: '🌊', explored: false },
  { type: 'mountain', icon: '🏔️', explored: false },
  { type: 'forest', icon: '🌳', explored: false }
]);

const addMessage = (content) => {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  messageLog.value.push({ time, content });
  // 只保留最近20条日志
  if (messageLog.value.length > 20) {
    messageLog.value.shift();
  }
};

const performAction = (name, cost, gain, time) => {
  // 检查资源是否足够
  for (const [resource, amount] of Object.entries(cost)) {
    if (resources.value[resource] < amount) {
      ElMessage.error(`资源不足，无法${name}`);
      return false;
    }
  }
  
  // 消耗资源
  for (const [resource, amount] of Object.entries(cost)) {
    resources.value[resource] -= amount;
  }
  
  addMessage(`开始${name}...`);
  
  // 模拟耗时
  setTimeout(() => {
    // 获得资源
    for (const [resource, amount] of Object.entries(gain)) {
      resources.value[resource] += amount;
    }
    addMessage(`${name}完成！获得了${Object.entries(gain).map(([k, v]) => `${v}${k}`).join('、')}`);
    ElMessage.success(`${name}完成！`);
  }, time);
  
  return true;
};

const gatherFood = () => {
  performAction('采集食物', {}, { food: 20 }, 30000);
};

const collectWater = () => {
  performAction('收集淡水', {}, { water: 30 }, 60000);
};

const chopWood = () => {
  performAction('砍伐木材', {}, { wood: 15 }, 120000);
};

const mineStone = () => {
  performAction('挖掘石头', {}, { stone: 10 }, 180000);
};

const buildShelter = () => {
  if (performAction('建造庇护所', { wood: 50, stone: 30 }, {}, 300000)) {
    addMessage('庇护所建造完成！你现在有了一个安全的住所。');
  }
};

const craftTools = () => {
  if (performAction('制作工具', { wood: 20, stone: 10 }, {}, 120000)) {
    addMessage('工具制作完成！你的工作效率提高了。');
  }
};

const exploreCell = (index) => {
  const cell = mapGrid.value[index];
  if (cell.explored) {
    ElMessage.info('这个区域已经探索过了');
    return;
  }
  
  ElMessageBox.confirm(
    `确定要探索这个区域吗？可能会遇到危险或发现资源。`,
    '探索未知区域',
    {
      confirmButtonText: '开始探索',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    addMessage(`开始探索${cell.icon}区域...`);
    
    setTimeout(() => {
      cell.explored = true;
      
      // 随机事件
      const random = Math.random();
      if (random < 0.3) {
        const foodGain = Math.floor(Math.random() * 20) + 10;
        resources.value.food += foodGain;
        addMessage(`探索发现了食物！获得${foodGain}食物`);
        ElMessage.success(`探索发现了食物！获得${foodGain}食物`);
      } else if (random < 0.6) {
        const woodGain = Math.floor(Math.random() * 15) + 5;
        resources.value.wood += woodGain;
        addMessage(`探索发现了木材！获得${woodGain}木材`);
        ElMessage.success(`探索发现了木材！获得${woodGain}木材`);
      } else if (random < 0.8) {
        const stoneGain = Math.floor(Math.random() * 10) + 5;
        resources.value.stone += stoneGain;
        addMessage(`探索发现了石头！获得${stoneGain}石头`);
        ElMessage.success(`探索发现了石头！获得${stoneGain}石头`);
      } else {
        resources.value.food -= 10;
        resources.value.water -= 10;
        addMessage(`探索遇到了危险！损失了10食物和10水`);
        ElMessage.warning(`探索遇到了危险！损失了10食物和10水`);
      }
    }, 5000);
  }).catch(() => {
    addMessage('取消了探索');
  });
};

onMounted(() => {
  addMessage('欢迎来到海岛生存游戏！');
  // 定期消耗资源
  setInterval(() => {
    resources.value.food -= 5;
    resources.value.water -= 5;
    
    if (resources.value.food <= 0 || resources.value.water <= 0) {
      ElMessageBox.alert(
        '你的食物或水耗尽了，游戏结束！',
        '游戏结束',
        {
          confirmButtonText: '重新开始',
          type: 'error'
        }
      ).then(() => {
        resources.value.food = 100;
        resources.value.water = 100;
        resources.value.wood = 100;
        resources.value.stone = 100;
        addMessage('重新开始游戏！');
      });
    }
  }, 60000); // 每分钟消耗一次
});
</script>

<style scoped>
.island-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.island-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.island-header h1 {
  font-size: 48px;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.island-header p {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

.island-main {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 48px;
  margin-right: 20px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.actions-panel {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.actions-panel h3 {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.action-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.action-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.action-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.action-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.action-time,
.action-cost {
  font-size: 12px;
  color: #999;
}

.map-panel {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map-panel h3 {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
}

.map-container {
  text-align: center;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
}

.map-cell {
  width: 100px;
  height: 100px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #ddd;
}

.map-cell:hover {
  transform: scale(1.05);
  border-color: #667eea;
}

.map-cell.explored {
  background: #e8f4fa;
  border-color: #409eff;
}

.map-legend {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.legend-icon {
  font-size: 24px;
}

.message-log {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-log h3 {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
}

.log-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
}

.log-item {
  display: flex;
  margin-bottom: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.log-time {
  font-weight: bold;
  color: #409eff;
  margin-right: 12px;
  min-width: 60px;
}

.log-content {
  flex: 1;
  color: #666;
}

@media (max-width: 768px) {
  .island-header h1 {
    font-size: 32px;
  }
  
  .stats-panel {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style>