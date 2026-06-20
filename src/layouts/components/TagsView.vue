<template>
  <div class="tags-view-wrapper">
    <scroll-pane ref="scrollPane" class="tags-view-container">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    
    <!-- 右键菜单 -->
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        <i class="el-icon-refresh" /> 刷新
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <i class="el-icon-close" /> 关闭
      </li>
      <li @click="closeOthersTags">
        <i class="el-icon-s-data" /> 关闭其他
      </li>
      <li @click="closeAllTags(selectedTag)">
        <i class="el-icon-menu" /> 关闭全部
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '../../store';
import ScrollPane from './ScrollPane.vue';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const visitedViews = computed(() => appStore.getVisitedViews);
const cachedViews = computed(() => appStore.getCachedViews);

const visible = ref(false);
const top = ref(0);
const left = ref(0);
const selectedTag = ref(null);

const isActive = (tag) => {
  return tag.path === route.path;
};

const isAffix = (tag) => {
  return tag.meta?.affix || false;
};

const closeSelectedTag = (tag) => {
  appStore.delView(tag).then(({ visitedViews }) => {
    if (isActive(tag)) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        router.push(latestView.fullPath);
      } else {
        router.push('/');
      }
    }
  });
};

const closeOthersTags = () => {
  appStore.delOthersViews(selectedTag.value).then(({ visitedViews }) => {
    if (!isActive(visitedViews)) {
      router.push(visitedViews.slice(-1)[0].fullPath);
    }
  });
  visible.value = false;
};

const closeAllTags = (tag) => {
  appStore.delAllViews().then(({ visitedViews }) => {
    if (tag.meta?.affix) {
      router.push(tag.fullPath);
    } else if (visitedViews.length > 0) {
      router.push(visitedViews.slice(-1)[0].fullPath);
    } else {
      router.push('/');
    }
  });
  visible.value = false;
};

const refreshSelectedTag = (tag) => {
  router.replace({
    path: '/redirect' + tag.fullPath
  });
  visible.value = false;
};

const openMenu = (tag, e) => {
  const menuMinWidth = 105;
  const offsetLeft = document.body.offsetLeft;
  const offsetWidth = document.body.offsetWidth;
  const maxLeft = offsetWidth - menuMinWidth;
  const left = e.clientX - offsetLeft + 15;
  
  selectedTag.value = tag;
  left.value = left > maxLeft ? maxLeft : left;
  top.value = e.clientY;
  visible.value = true;
};

const closeMenu = () => {
  visible.value = false;
};

watch(
  () => route.path,
  () => {
    appStore.addVisitedView(route);
  }
);

onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});
</script>

<style scoped>
.tags-view-wrapper {
  position: relative;
  height: 34px;
  line-height: 34px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}

.tags-view-container {
  height: 100%;
  overflow: hidden;
}

.tags-view-item {
  display: inline-block;
  position: relative;
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 14px;
  margin-left: 5px;
  margin-top: 4px;
}

.tags-view-item.active {
  background-color: #409eff;
  color: #fff;
  border-color: #409eff;
}

.tags-view-item:hover {
  border-color: #409eff;
}

.tags-view-item.active:hover {
  border-color: #409eff;
}

.tags-view-item .el-icon-close {
  width: 16px;
  height: 16px;
  vertical-align: 2px;
  border-radius: 50%;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform-origin: 100% 50%;
}

.tags-view-item .el-icon-close:hover {
  background-color: #b3d8ff;
  color: #fff;
}

.tags-view-item.active .el-icon-close:hover {
  background-color: #fff;
  color: #409eff;
}

.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}

.contextmenu li:hover {
  background: #eee;
}
</style>