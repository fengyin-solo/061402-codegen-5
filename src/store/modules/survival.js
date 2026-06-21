import { defineStore } from 'pinia';

const MAIN_QUEST_POOL = [
  {
    id: 'main_1',
    title: '资源储备者',
    description: '收集足够的基础资源',
    type: 'main',
    objectives: [
      { type: 'resource', resource: 'food', target: 200, label: '食物达到200' },
      { type: 'resource', resource: 'water', target: 200, label: '淡水达到200' }
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
      { type: 'explore', target: 5, label: '探索5个新区域' }
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
      { type: 'action', action: 'buildShelter', target: 1, label: '建造1个庇护所' },
      { type: 'action', action: 'craftTools', target: 1, label: '制作1套工具' }
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
      { type: 'resource', resource: 'food', target: 500, label: '食物达到500' },
      { type: 'resource', resource: 'wood', target: 300, label: '木材达到300' }
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
      { type: 'action', action: 'chopWood', target: 5, label: '砍伐5次木材' }
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
      { type: 'action', action: 'mineStone', target: 5, label: '挖掘5次石头' }
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
      { type: 'action', action: 'gatherFood', target: 8, label: '采集8次食物' }
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
      { type: 'action', action: 'collectWater', target: 6, label: '收集6次淡水' }
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
      { type: 'explore', target: 3, label: '探索3个新区域' }
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
      { type: 'action', action: 'gatherFood', target: 3, label: '采集3次食物' },
      { type: 'action', action: 'collectWater', target: 3, label: '收集3次淡水' }
    ],
    rewards: { food: 40, water: 40, wood: 20, stone: 20 },
    rewardText: '奖励: 40食物, 40淡水, 20木材, 20石头'
  }
];

const STORAGE_KEY = 'island_survival_state_v1';

const seededRandom = (seed) => {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = ((s << 5) - s) + seed.charCodeAt(i);
    s |= 0;
  }
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export default defineStore('survival', {
  state: () => ({
    currentDate: null,
    mainQuest: null,
    sideQuests: [],
    completedQuests: [],
    claimedRewards: [],

    baselineResources: { food: 0, water: 0, wood: 0, stone: 0 },
    baselineExploreCount: 0,
    baselineActionCount: {},

    currentActionCount: {},

    baselineMapGrid: null,
    baselineMessageLog: [],

    gameStateLoaded: false
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
    _getStorageState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to load state:', e);
        return null;
      }
    },

    _saveStorageState(extra = {}) {
      try {
        const state = {
          currentDate: this.currentDate,
          mainQuest: this.mainQuest,
          sideQuests: this.sideQuests,
          completedQuests: this.completedQuests,
          claimedRewards: this.claimedRewards,
          baselineResources: this.baselineResources,
          baselineExploreCount: this.baselineExploreCount,
          baselineActionCount: this.baselineActionCount,
          currentActionCount: this.currentActionCount,
          ...extra
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Failed to save state:', e);
      }
    },

    _clearStorageState() {
      localStorage.removeItem(STORAGE_KEY);
    },

    _generateQuestsForDate(dateStr) {
      const rand = seededRandom(dateStr);

      const mainIndex = Math.floor(rand() * MAIN_QUEST_POOL.length);
      const mainQuest = deepClone(MAIN_QUEST_POOL[mainIndex]);
      mainQuest.objectives.forEach(obj => obj.current = 0);

      const indices = [];
      while (indices.length < 3 && indices.length < SIDE_QUEST_POOL.length) {
        const idx = Math.floor(rand() * SIDE_QUEST_POOL.length);
        if (!indices.includes(idx)) indices.push(idx);
      }
      const sideQuests = indices.map(i => {
        const q = deepClone(SIDE_QUEST_POOL[i]);
        q.objectives.forEach(obj => obj.current = 0);
        return q;
      });

      return { mainQuest, sideQuests };
    },

    generateDailyQuests(currentResources, currentExploreCount, initialActionCount = {}) {
      const today = new Date().toDateString();
      this.currentDate = today;

      this.baselineResources = deepClone(currentResources);
      this.baselineExploreCount = currentExploreCount;
      this.baselineActionCount = deepClone(initialActionCount);
      this.currentActionCount = deepClone(initialActionCount);

      const { mainQuest, sideQuests } = this._generateQuestsForDate(today);
      this.mainQuest = mainQuest;
      this.sideQuests = sideQuests;

      this.claimedRewards = [];

      this._saveStorageState();
    },

    loadOrGenerateDailyQuests(currentResources, currentExploreCount, initialActionCount = {}) {
      const today = new Date().toDateString();
      const stored = this._getStorageState();

      if (stored && stored.currentDate === today) {
        this.currentDate = stored.currentDate;
        this.mainQuest = stored.mainQuest;
        this.sideQuests = stored.sideQuests;
        this.completedQuests = stored.completedQuests || [];
        this.claimedRewards = stored.claimedRewards || [];
        this.baselineResources = stored.baselineResources || deepClone(currentResources);
        this.baselineExploreCount = stored.baselineExploreCount || currentExploreCount;
        this.baselineActionCount = stored.baselineActionCount || deepClone(initialActionCount);
        this.currentActionCount = stored.currentActionCount || deepClone(initialActionCount);
        this.gameStateLoaded = true;
        return { loaded: true, stored };
      } else {
        if (stored) this._clearStorageState();
        this.generateDailyQuests(currentResources, currentExploreCount, initialActionCount);
        this.gameStateLoaded = true;
        return { loaded: false, stored: null };
      }
    },

    updateActionProgress(actionName, save = true) {
      if (this.currentActionCount[actionName] === undefined) {
        this.currentActionCount[actionName] = 0;
      }
      this.currentActionCount[actionName]++;

      const baseline = this.baselineActionCount[actionName] || 0;
      const delta = Math.max(0, this.currentActionCount[actionName] - baseline);

      [this.mainQuest, ...this.sideQuests].forEach(quest => {
        if (!quest) return;
        quest.objectives.forEach(obj => {
          if (obj.type === 'action' && obj.action === actionName) {
            obj.current = Math.min(delta, obj.target);
          }
        });
      });

      if (save) this._saveStorageState();
    },

    updateResourceProgress(resources, save = true) {
      [this.mainQuest, ...this.sideQuests].forEach(quest => {
        if (!quest) return;
        quest.objectives.forEach(obj => {
          if (obj.type === 'resource' && resources[obj.resource] !== undefined) {
            const baseline = this.baselineResources[obj.resource] || 0;
            const delta = Math.max(0, resources[obj.resource] - baseline);
            obj.current = Math.min(delta, obj.target);
          }
        });
      });
      if (save) this._saveStorageState();
    },

    updateExploreProgress(totalExplored, save = true) {
      const delta = Math.max(0, totalExplored - this.baselineExploreCount);

      [this.mainQuest, ...this.sideQuests].forEach(quest => {
        if (!quest) return;
        quest.objectives.forEach(obj => {
          if (obj.type === 'explore') {
            obj.current = Math.min(delta, obj.target);
          }
        });
      });

      if (save) this._saveStorageState();
    },

    claimReward(questId) {
      const quest = [...this.sideQuests, this.mainQuest].find(q => q && q.id === questId);

      if (!quest) return null;
      if (this.claimedRewards.includes(questId)) return null;

      const isCompleted = quest.objectives.every(obj => obj.current >= obj.target);
      if (!isCompleted) return null;

      this.claimedRewards.push(questId);
      this.completedQuests.push({
        ...deepClone(quest),
        completedAt: new Date().toISOString()
      });

      this._saveStorageState();
      return deepClone(quest.rewards);
    },

    resetDaily(currentResources, currentExploreCount, initialActionCount = {}) {
      const today = new Date().toDateString();
      if (this.currentDate !== today) {
        this._clearStorageState();
        this.generateDailyQuests(currentResources, currentExploreCount, initialActionCount);
      }
    }
  }
});
