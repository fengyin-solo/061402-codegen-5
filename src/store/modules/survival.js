import { defineStore } from 'pinia';

const MAIN_QUEST_POOL = [
  {
    id: 'main_1',
    title: '资源储备者',
    description: '收集足够的基础资源',
    type: 'main',
    objectives: [
      { type: 'resource', resource: 'food', target: 200, current: 0, label: '食物达到200' },
      { type: 'resource', resource: 'water', target: 200, current: 0, label: '淡水达到200' }
    ],
    rewards: { food: 50, water: 50, wood: 30, stone: 20 },
    rewardText: '奖励: 50食物, 50淡水, 30木材, 20石头'
  },
  {
    id: 'main_2',
    title: '探索先锋',
    description: '探索海岛上的未知区域',
    type: 'main',
    objectives: [
      { type: 'explore', target: 5, current: 0, label: '探索5个新区域' }
    ],
    rewards: { food: 80, water: 80, wood: 50, stone: 40 },
    rewardText: '奖励: 80食物, 80淡水, 50木材, 40石头'
  },
  {
    id: 'main_3',
    title: '建筑大师',
    description: '建造基础设施',
    type: 'main',
    objectives: [
      { type: 'action', action: 'buildShelter', target: 1, current: 0, label: '建造1个庇护所' },
      { type: 'action', action: 'craftTools', target: 1, current: 0, label: '制作1套工具' }
    ],
    rewards: { food: 100, water: 100, wood: 60, stone: 50 },
    rewardText: '奖励: 100食物, 100淡水, 60木材, 50石头'
  },
  {
    id: 'main_4',
    title: '生存专家',
    description: '坚持生存并积累资源',
    type: 'main',
    objectives: [
      { type: 'resource', resource: 'food', target: 500, current: 0, label: '食物达到500' },
      { type: 'resource', resource: 'wood', target: 300, current: 0, label: '木材达到300' }
    ],
    rewards: { food: 150, water: 150, wood: 80, stone: 60 },
    rewardText: '奖励: 150食物, 150淡水, 80木材, 60石头'
  }
];

const SIDE_QUEST_POOL = [
  {
    id: 'side_1',
    title: '伐木工人',
    description: '砍伐大量木材',
    type: 'side',
    objectives: [
      { type: 'action', action: 'chopWood', target: 5, current: 0, label: '砍伐5次木材' }
    ],
    rewards: { wood: 50 },
    rewardText: '奖励: 50木材'
  },
  {
    id: 'side_2',
    title: '矿工',
    description: '挖掘石头',
    type: 'side',
    objectives: [
      { type: 'action', action: 'mineStone', target: 5, current: 0, label: '挖掘5次石头' }
    ],
    rewards: { stone: 40 },
    rewardText: '奖励: 40石头'
  },
  {
    id: 'side_3',
    title: '美食家',
    description: '采集大量食物',
    type: 'side',
    objectives: [
      { type: 'action', action: 'gatherFood', target: 8, current: 0, label: '采集8次食物' }
    ],
    rewards: { food: 60 },
    rewardText: '奖励: 60食物'
  },
  {
    id: 'side_4',
    title: '水源收集者',
    description: '收集淡水',
    type: 'side',
    objectives: [
      { type: 'action', action: 'collectWater', target: 6, current: 0, label: '收集6次淡水' }
    ],
    rewards: { water: 70 },
    rewardText: '奖励: 70淡水'
  },
  {
    id: 'side_5',
    title: '探险家',
    description: '探索更多区域',
    type: 'side',
    objectives: [
      { type: 'explore', target: 3, current: 0, label: '探索3个新区域' }
    ],
    rewards: { food: 30, water: 30, wood: 20 },
    rewardText: '奖励: 30食物, 30淡水, 20木材'
  },
  {
    id: 'side_6',
    title: '全能生存者',
    description: '执行各种生存活动',
    type: 'side',
    objectives: [
      { type: 'action', action: 'gatherFood', target: 3, current: 0, label: '采集3次食物' },
      { type: 'action', action: 'collectWater', target: 3, current: 0, label: '收集3次淡水' }
    ],
    rewards: { food: 40, water: 40, wood: 20, stone: 20 },
    rewardText: '奖励: 40食物, 40淡水, 20木材, 20石头'
  }
];

export default defineStore('survival', {
  state: () => ({
    currentDate: null,
    mainQuest: null,
    sideQuests: [],
    completedQuests: [],
    actionCount: {},
    exploreCount: 0,
    totalExploreCount: 0,
    claimedRewards: []
  }),

  getters: {
    getMainQuest: (state) => state.mainQuest,
    getSideQuests: (state) => state.sideQuests,
    getCompletedQuests: (state) => state.completedQuests,
    isQuestCompleted: (state) => (questId) => {
      const quest = [...state.sideQuests, state.mainQuest].find(q => q && q.id === questId);
      if (!quest) return false;
      return quest.objectives.every(obj => obj.current >= obj.target);
    },
    isQuestClaimed: (state) => (questId) => state.claimedRewards.includes(questId)
  },

  actions: {
    generateDailyQuests() {
      const today = new Date().toDateString();
      if (this.currentDate === today) return;

      this.currentDate = today;

      const mainIndex = Math.floor(Math.random() * MAIN_QUEST_POOL.length);
      this.mainQuest = JSON.parse(JSON.stringify(MAIN_QUEST_POOL[mainIndex]));

      const shuffled = [...SIDE_QUEST_POOL].sort(() => Math.random() - 0.5);
      this.sideQuests = shuffled.slice(0, 3).map(q => JSON.parse(JSON.stringify(q)));

      this.actionCount = {};
      this.exploreCount = 0;
      this.claimedRewards = [];
    },

    updateActionProgress(actionName) {
      if (this.actionCount[actionName] === undefined) {
        this.actionCount[actionName] = 0;
      }
      this.actionCount[actionName]++;

      const count = this.actionCount[actionName];

      [this.mainQuest, ...this.sideQuests].forEach(quest => {
        if (!quest) return;
        quest.objectives.forEach(obj => {
          if (obj.type === 'action' && obj.action === actionName) {
            obj.current = Math.min(count, obj.target);
          }
        });
      });
    },

    updateResourceProgress(resources) {
      [this.mainQuest, ...this.sideQuests].forEach(quest => {
        if (!quest) return;
        quest.objectives.forEach(obj => {
          if (obj.type === 'resource' && resources[obj.resource] !== undefined) {
            obj.current = Math.min(resources[obj.resource], obj.target);
          }
        });
      });
    },

    updateExploreProgress(totalExplored) {
      const newExplores = Math.max(0, totalExplored - this.totalExploreCount);
      if (newExplores > 0) {
        this.exploreCount += newExplores;
        this.totalExploreCount = totalExplored;

        [this.mainQuest, ...this.sideQuests].forEach(quest => {
          if (!quest) return;
          quest.objectives.forEach(obj => {
            if (obj.type === 'explore') {
              obj.current = Math.min(this.exploreCount, obj.target);
            }
          });
        });
      } else {
        this.totalExploreCount = totalExplored;
      }
    },

    claimReward(questId) {
      const quest = [...this.sideQuests, this.mainQuest].find(q => q && q.id === questId);

      if (!quest) return null;
      if (this.claimedRewards.includes(questId)) return null;

      const isCompleted = quest.objectives.every(obj => obj.current >= obj.target);
      if (!isCompleted) return null;

      this.claimedRewards.push(questId);
      this.completedQuests.push({
        ...quest,
        completedAt: new Date().toISOString()
      });

      return quest.rewards;
    },

    resetDaily() {
      const today = new Date().toDateString();
      if (this.currentDate !== today) {
        this.generateDailyQuests();
      }
    }
  }
});
