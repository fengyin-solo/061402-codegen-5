<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query, item.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path, onlyOneChild.query, item.path)" :class="{'submenu-title-noDropdown': !isNest}">
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path, item.query, item.path)" popper-append-to-body>
      <template #title>
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path, child.query, item.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { isExternal } from '../../utils/validate';
import Item from './Item.vue';

const props = defineProps({
  // route object
  item: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
});

const resolvePath = (routePath, routeQuery, basePath) => {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(basePath)) {
    return basePath;
  }
  return basePath ? `${basePath}/${routePath}` : routePath;
};

const hasOneShowingChild = (children = [], parent) => {
  const showingChildren = children.filter(item => {
    if (item.hidden) {
      return false;
    } else {
      // Temp set(will be used if only has one showing child)
      this.onlyOneChild = item;
      return true;
    }
  });

  // When there is only one child route, the child route is displayed by default
  if (showingChildren.length === 1) {
    return true;
  }

  // Show parent if there are no child route to display
  if (showingChildren.length === 0) {
    this.onlyOneChild = { ...parent, path: '', noShowingChildren: true };
    return true;
  }

  return false;
};

const onlyOneChild = ref({});
</script>

<style scoped>
.nest-menu {
  padding-left: 20px;
}
</style>