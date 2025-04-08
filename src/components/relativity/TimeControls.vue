<template>
  <div class="time-controls">
    <div class="time-controls-header">
      <h3>Time Controls</h3>
      <span class="time-display">t = {{ displayTime.toFixed(2) }}</span>
    </div>
    <div class="button-group">
      <button
        class="control-button play-pause"
        :class="{ 'is-playing': isAnimating }"
        @click="toggleAnimation"
      >
        <span class="button-icon">{{ isAnimating ? '⏸️' : '▶️' }}</span>
        <span class="button-text">{{ isAnimating ? 'Pause' : 'Play' }}</span>
      </button>
      <button
        class="control-button reset"
        @click="resetSimulation"
      >
        <span class="button-icon">↺</span>
        <span class="button-text">Reset</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});

const props = defineProps<{
  time: number;
}>();

const emit = defineEmits(['reset', 'updateTime']);

const isAnimating = ref<boolean>(false);
const lastTimestamp = ref(0);
let animationFrameId: number | null = null;

const displayTime = computed(() => props.time);

function toggleAnimation(): void {
  isAnimating.value = !isAnimating.value;

  if (isAnimating.value) {
    lastTimestamp.value = 0;
    animationFrameId = requestAnimationFrame(animate);
  }
}

function resetSimulation(): void {
  isAnimating.value = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  emit('reset');
}

function animate(timestamp: number): void {
  if (!isAnimating.value) return;

  if (lastTimestamp.value === 0) {
    lastTimestamp.value = timestamp;
  }
  const deltaTime = (timestamp - lastTimestamp.value) / 1000;
  lastTimestamp.value = timestamp;

  emit('updateTime', props.time + deltaTime);

  animationFrameId = requestAnimationFrame(animate);
}
</script>

<style scoped>
.time-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.time-display {
  font-family: monospace;
  font-size: 14px;
  color: #666;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 8px;
}

.control-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f0f0f0;
  color: #333;
}

.control-button:hover {
  background-color: #e0e0e0;
}

.control-button.play-pause {
  background-color: #3498db;
  color: white;
}

.control-button.play-pause:hover {
  background-color: #2980b9;
}

.control-button.reset {
  background-color: #f0f0f0;
  color: #666;
}

.control-button.reset:hover {
  background-color: #e0e0e0;
}

.button-icon {
  font-size: 16px;
}

.button-text {
  font-weight: 500;
}
</style>
