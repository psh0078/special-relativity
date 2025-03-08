<template>
  <div class="time-controls">
    <button @click="toggleAnimation">
      {{ isAnimating ? 'Pause' : 'Play' }}
    </button>
    <button @click="resetSimulation">
      Reset
    </button>
    <span class="time-display">Time: {{ displayTime.toFixed(2) }}</span>
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
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
