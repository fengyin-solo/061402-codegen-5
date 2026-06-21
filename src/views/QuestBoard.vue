<template>
  <div class="quest-board">
    <div class="quest-header">
      <h3>📋 生存任务板</h3>
      <div class="quest-date">
        <span class="date-label">今日任务</span>
        <span class="date-value">{{ currentDate }}</span>
      </div>
    </div>

    <div v-if="mainQuest" class="quest-section main-quest">
      <div class="section-title">
        <span class="title-icon">⭐</span>
        <span>主线任务</span>
      </div>
      <div class="quest-card main">
        <div class="quest-title-row">
          <h4 class="quest-title">{{ mainQuest.title }}</h4>
          <el-tag type="warning" effect="dark">主线</el-tag>
        </div>
        <p class="quest-desc">{{ mainQuest.description }}</p>
        
        <div class="quest-objectives">
          <div v-for="(obj, index) in mainQuest.objectives" :key="index" class="objective-item">
            <div class="objective-info">
              <span class="objective-label">{{ obj.label }}</span>
              <span class="objective-progress">{{ obj.current }} / {{ obj.target }}</span>
            </div>
            <el-progress 
              :percentage="Math.floor((obj.current / obj.target) * 100)" 
              :status="obj.current >= obj.target ? 'success' : ''"
              :stroke-width="8"
            />
          </div>
        </div>

        <div class="quest-reward">
          <span class="reward-text">{{ mainQuest.rewardText }}</span>
        </div>

        <el-button 
          type="success" 
          class="claim-btn"
          :disabled="!isCompleted(mainQuest) || isClaimed(mainQuest.id)"
          @click="handleClaim(mainQuest)"
        >
          {{ isClaimed(mainQuest.id) ? '已领取' : (isCompleted(mainQuest) ? '领取奖励' : '未完成') }}
        </el-button>
      </div>
    </div>

    <div class="quest-section side-quests">
      <div class="section-title">
        <span class="title-icon">📝</span>
        <span>支线任务</span>
      </div>
      <div class="side-quest-list">
        <div v-for="quest in sideQuests" :key="quest.id" class="quest-card side">
          <div class="quest-title-row">
            <h4 class="quest-title">{{ quest.title }}</h4>
            <el-tag type="info" effect="light">支线</el-tag>
          </div>
          <p class="quest-desc">{{ quest.description }}</p>
          
          <div class="quest-objectives">
            <div v-for="(obj, index) in quest.objectives" :key="index" class="objective-item">
              <div class="objective-info">
                <span class="objective-label">{{ obj.label }}</span>
                <span class="objective-progress">{{ obj.current }} / {{ obj.target }}</span>
              </div>
              <el-progress 
                :percentage="Math.floor((obj.current / obj.target) * 100)" 
                :status="obj.current >= obj.target ? 'success' : ''"
                :stroke-width="6"
              />
            </div>
          </div>

          <div class="quest-reward">
            <span class="reward-text">{{ quest.rewardText }}</span>
          </div>

          <el-button 
            type="primary" 
            class="claim-btn"
            :disabled="!isCompleted(quest) || isClaimed(quest.id)"
            @click="handleClaim(quest)"
          >
            {{ isClaimed(quest.id) ? '已领取' : (isCompleted(quest) ? '领取奖励' : '未完成') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useSurvivalStore } from '../store';

const emit = defineEmits(['claim-reward']);

const survivalStore = useSurvivalStore();

const mainQuest = computed(() => survivalStore.mainQuest);
const sideQuests = computed(() => survivalStore.sideQuests);

const currentDate = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
});

const isCompleted = (quest) => {
  if (!quest) return false;
  return quest.objectives.every(obj => obj.current >= obj.target);
};

const isClaimed = (questId) => {
  return survivalStore.isQuestClaimed(questId);
};

const handleClaim = (quest) => {
  const rewards = survivalStore.claimReward(quest.id);
  if (rewards) {
    emit('claim-reward', rewards, quest);
    const rewardList = Object.entries(rewards)
      .map(([key, value]) => `${value}${getResourceLabel(key)}`)
      .join('、');
    ElMessage.success(`领取成功！获得 ${rewardList}`);
  }
};

const getResourceLabel = (key) => {
  const labels = {
    food: '食物',
    water: '淡水',
    wood: '木材',
    stone: '石头'
  };
  return labels[key] || key;
};
</script>

<style scoped>
.quest-board {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.quest-header h3 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.quest-date {
  text-align: right;
}

.date-label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.date-value {
  font-size: 14px;
  font-weight: bold;
  color: #667eea;
}

.quest-section {
  margin-bottom: 30px;
}

.quest-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.title-icon {
  font-size: 20px;
}

.quest-card {
  background: #fafafa;
  border-radius: 10px;
  padding: 20px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.quest-card.main {
  background: linear-gradient(135deg, #fff7e6 0%, #fff1d6 100%);
  border-color: #ffd480;
}

.quest-card.side {
  background: #f5f7fa;
  border-color: #e4e7ed;
}

.quest-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quest-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.quest-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.quest-desc {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #666;
}

.quest-objectives {
  margin-bottom: 15px;
}

.objective-item {
  margin-bottom: 12px;
}

.objective-item:last-child {
  margin-bottom: 0;
}

.objective-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.objective-label {
  font-size: 13px;
  color: #666;
}

.objective-progress {
  font-size: 13px;
  font-weight: bold;
  color: #409eff;
}

.quest-reward {
  margin-bottom: 15px;
  padding: 10px 15px;
  background: rgba(103, 194, 58, 0.1);
  border-radius: 6px;
}

.reward-text {
  font-size: 13px;
  color: #67c23a;
  font-weight: 500;
}

.claim-btn {
  width: 100%;
}

.side-quest-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

@media (max-width: 768px) {
  .quest-board {
    padding: 20px;
  }

  .quest-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .quest-date {
    text-align: left;
  }

  .side-quest-list {
    grid-template-columns: 1fr;
  }
}
</style>
