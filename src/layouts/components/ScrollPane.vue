<template>
  <div class="scroll-pane" ref="root">
    <div class="scroll-wrapper" ref="wrapper" @scroll="handleScroll">
      <div class="scroll-content" ref="content">
        <slot />
      </div>
    </div>
    <div
      v-show="leftVisible"
      class="scrollbar scrollbar-left"
      @mousedown="(e) => startDrag('left', e)"
    >
      <div class="scrollbar-thumb" />
    </div>
    <div
      v-show="rightVisible"
      class="scrollbar scrollbar-right"
      @mousedown="(e) => startDrag('right', e)"
    >
      <div class="scrollbar-thumb" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const root = ref(null);
const wrapper = ref(null);
const content = ref(null);

const leftVisible = ref(false);
const rightVisible = ref(false);
const isDragging = ref(false);
const startX = ref(0);
const startScrollLeft = ref(0);

const handleScroll = () => {
  updateScrollButtons();
};

const updateScrollButtons = () => {
  if (!wrapper.value || !content.value) return;
  
  const { scrollLeft, clientWidth, scrollWidth } = wrapper.value;
  const maxScrollLeft = scrollWidth - clientWidth;
  
  leftVisible.value = scrollLeft > 0;
  rightVisible.value = scrollLeft < maxScrollLeft;
};

const scrollBy = (delta) => {
  if (wrapper.value) {
    wrapper.value.scrollLeft += delta;
  }
};

const startDrag = (direction, e) => {
  isDragging.value = true;
  startX.value = e.clientX;
  startScrollLeft.value = wrapper.value.scrollLeft;
  
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  e.preventDefault();
};

const handleDrag = (e) => {
  if (!isDragging.value) return;
  
  const delta = e.clientX - startX.value;
  const scrollDelta = delta * 2;
  wrapper.value.scrollLeft = startScrollLeft.value - scrollDelta;
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
};

const scrollToLeft = () => {
  scrollBy(-300);
};

const scrollToRight = () => {
  scrollBy(300);
};

onMounted(() => {
  updateScrollButtons();
  window.addEventListener('resize', updateScrollButtons);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScrollButtons);
});

defineExpose({
  scrollToLeft,
  scrollToRight
});
</script>

<style scoped>
.scroll-pane {
  position: relative;
  overflow: hidden;
}

.scroll-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.scroll-content {
  display: inline-block;
}

.scrollbar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 24px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  cursor: pointer;
  z-index: 1;
}

.scrollbar-left {
  left: 0;
}

.scrollbar-right {
  right: 0;
}

.scrollbar:hover {
  background: rgba(0, 0, 0, 0.2);
}

.scrollbar-thumb {
  width: 8px;
  height: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  margin: 4px;
}

.scroll-wrapper::-webkit-scrollbar {
  display: none;
}
</style>