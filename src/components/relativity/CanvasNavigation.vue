<template>
  <div class="canvas-navigation">
    <div class="navigation-row">
      <button
        class="nav-button left"
        @click="scrollLeft"
      >
        &lt;
      </button>
      <div
        ref="scrollContainer"
        class="scrollable-wrapper"
      >
        <slot />
      </div>
      <button
        class="nav-button right"
        @click="scrollRight"
      >
        &gt;
      </button>
    </div>
    <button
      class="return-to-origin"
      @click="returnToOrigin"
    >
      Return to Origin
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  canvasWidth: number;
  visibleWidth: number;
}>();

const scrollContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  returnToOrigin();
});

function scrollLeft() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -100,
      behavior: 'smooth'
    });
  }
}

function scrollRight() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: 100,
      behavior: 'smooth'
    });
  }
}

function returnToOrigin() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      left: (props.canvasWidth - props.visibleWidth) / 2,
      behavior: 'smooth'
    });
  }
}
</script>

<style scoped>
.canvas-navigation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 20px auto;
  max-width: 800px;
}

.navigation-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.scrollable-wrapper {
  width: 700px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  border: 1px solid #ccc;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollable-wrapper::-webkit-scrollbar {
  display: none;
}

.nav-button {
  padding: 10px 15px;
  font-size: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: #e0e0e0;
}

.return-to-origin {
  display: block;
  margin: 10px auto;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.return-to-origin:hover {
  background-color: #45a049;
}
</style>
