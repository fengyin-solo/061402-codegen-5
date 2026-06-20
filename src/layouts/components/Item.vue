<template>
  <div class="sidebar-item">
    <svg-icon v-if="icon" :icon-class="icon" />
    <span v-else :class="'el-icon-' + icon" v-if="icon" />
    <span class="sidebar-title">{{ title }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
});

const hasIcon = computed(() => props.icon);
</script>

<style scoped>
.sidebar-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.sidebar-title {
  margin-left: 10px;
}
</style>